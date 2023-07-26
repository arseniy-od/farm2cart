import {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
    PreviewData,
} from 'next'
import { ParsedUrlQuery } from 'querystring'

import {
    NextApiRequestFile,
    NextApiRequestWithUser,
    category,
    good,
} from '@/app/types/interfaces'

import USE from '../decorators/use'
import GET from '../decorators/get'
import POST from '../decorators/post'
import DELETE from '../decorators/delete'
import PATCH from '../decorators/patch'
import PUT from '../decorators/put'
import SSR from '../decorators/ssr'

import BaseController from './baseController'
import session, { passportInit, passportSession } from '@/middleware/session'
import uploadMiddleware from '@/middleware/upload'
import validate from '../validation/validator'
import { goodSchema } from '../validation/schemas'
import {
    categorySchema,
    orderGoodsSchema,
    reviewSchema,
    userSchema,
} from '@/redux/normalSchemas'
import { IGoodModel } from '../database/models/good'
import {
    CATEGORY_GOODS_TABLE,
    GOODS_TABLE,
    MY_GOODS_TABLE,
    USER_GOODS_TABLE,
} from '@/app/constants'
import { clientDi } from '@/redux/container'

@USE([session, passportInit, passportSession])
export default class GoodController extends BaseController {
    private GoodService = this.di.GoodService
    private CategoryService = this.di.CategoryService

    constructor(opts) {
        super(opts)
        this.schema = clientDi('GoodEntity').schema
        // this.initSchema('goods', {
        //     seller: userSchema,
        //     categories: [categorySchema],
        //     reviews: [reviewSchema],
        //     OrderGood: orderGoodsSchema,
        // })
    }

    @SSR('/')
    @SSR('/categories/:slug')
    @SSR('/users/:id')
    @GET('/api/goods')
    async getPaginatedGoods({ query, identity, params }) {
        const categorySlug = params?.slug || query?.categorySlug
        const page = query?.page || 1
        const searchQuery = query?.search || ''
        const currentUser = query?.currentUser
        const userId = params?.id || query?.userId
        const escapedSearchQuery = searchQuery.replace(/['"]+/g, '')
        // console.log('\n\nsearch:', searchQuery)

        if (userId || currentUser) {
            const goods = await this.GoodService.getGoodsBySellerId(
                page,
                userId || identity.id,
                escapedSearchQuery
            )
            goods.pageName = USER_GOODS_TABLE
            return goods
        }

        if (categorySlug) {
            const category = await this.CategoryService.getCategoryByText(
                categorySlug
            )

            const goods = await this.GoodService.getGoodsByCategoryId(
                page,
                category?.id || 0,
                escapedSearchQuery
            )
            goods.pageName = CATEGORY_GOODS_TABLE
            return goods
        }

        const goods = await this.GoodService.getPaginatedGoods(
            page,
            escapedSearchQuery
        )
        goods.pageName = GOODS_TABLE
        return goods
    }

    // @SSR('/users/:id')
    // async getGoodsForUser({ query, params }) {
    //     const { id } = params
    //     if (!id || id instanceof Array) {
    //         return {
    //             props: { error: true, message: 'User not found' },
    //         }
    //     }
    //     const page = query?.page || 1
    //     const searchQuery = query?.search || ''
    //     const escapedSearchQuery = searchQuery.replace(/['"]+/g, '')

    //     const goods = await this.GoodService.getGoodsBySellerId(
    //         page,
    //         id,
    //         escapedSearchQuery
    //     )
    //     goods.pageName = USER_GOODS_TABLE
    //     return goods
    // }

    @POST('/api/goods')
    // @USE(validate(goodSchema)) // problems with form-data
    @USE(uploadMiddleware)
    async createGood({ body, identity, file }: NextApiRequestFile) {
        if (!identity) {
            return { error: true, message: 'You are not logged in' }
        }
        const goodData = { ...body, seller_id: identity.id }
        console.log('[api/goods] goodData before: ', goodData)
        if (!(goodData.categories instanceof Array)) {
            goodData.categories = [goodData.categories]
        }
        console.log('[api/goods] goodData after:', goodData)

        if (file) {
            goodData.imageUrl = file.path.replace('public', '')
        }
        // console.log('[api/goods] goodData: ', goodData)

        const good = await this.GoodService.createGood(goodData)
        console.log('[api/goods] Good: ', good)
        return good
    }

    @PUT('/api/goods')
    @USE(uploadMiddleware)
    // @USE(validate(goodSchema)) // problems with form-data
    async updateGood({ body, identity, file }: NextApiRequestFile) {
        // console.log('==========[GoodController]==============')
        console.log('Body:', body)
        if (!identity) {
            return { error: true, message: 'You are not logged in' }
        }

        const goodData = { ...body }
        const currentGood = await this.GoodService.getGoodById(goodData.id)
        if (currentGood?.seller_id !== identity.id) {
            return { error: true, message: 'You are not owner of this good' }
        }
        // console.log('[api/goods] goodData before: ', goodData)
        if (!(goodData.categories instanceof Array)) {
            goodData.categories = [goodData.categories]
        }
        // console.log('[api/goods] goodData after:', goodData)

        if (file) {
            console.log('File:', file)
            goodData.imageUrl = file.path.replace('public', '')
        }

        const good = await this.GoodService.updateGood(goodData)
        return good
    }

    @PATCH('/api/goods')
    @USE(uploadMiddleware)
    // @USE(validate(goodSchema)) // problems with form-data
    async updateGoodPatch({ body, identity, file, query }: NextApiRequestFile) {
        if (!identity) {
            return { error: true, message: 'You are not logged in' }
        }
        const goodData = { ...body, id: query.id, active: true }
        const currentGood = await this.GoodService.getGoodById(goodData.id)
        if (currentGood?.seller_id !== identity.id) {
            return { error: true, message: 'You are not owner of this good' }
        }
        // console.log('[api/goods] goodData before: ', goodData)
        if (!(goodData.categories instanceof Array) && goodData.categories) {
            goodData.categories = [goodData.categories]
        }
        // console.log('[api/goods] goodData after:', goodData)

        if (file) {
            console.log('File:', file)
            goodData.imageUrl = file.path.replace('public', '')
        }
        const good = await this.GoodService.patchGood(goodData)
        return good
    }

    @DELETE('/api/goods')
    async deleteGood(req: NextApiRequest) {
        if (req.query.id && typeof req.query.id === 'string') {
            const good = await this.GoodService.deleteGood(req.query.id)
            return good
        } else {
            return { error: true, message: 'id not found or id is an array' }
        }
    }

    @SSR('/goods/:id')
    async getGood({ params }) {
        const { id } = params
        if (!id || id instanceof Array) {
            return { notFound: true }
        }
        return await this.GoodService.getGoodByIdExtended(id)
    }
}

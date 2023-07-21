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

@USE([session, passportInit, passportSession])
export default class GoodController extends BaseController {
    private GoodService = this.di.GoodService

    constructor(opts) {
        super(opts)
        this.initSchema('goods', {
            seller: userSchema,
            categories: [categorySchema],
            reviews: [reviewSchema],
            OrderGood: orderGoodsSchema,
        })
    }

    async getGoodsApi({ query }) {
        const page = query?.page || 1
        console.log('\n\n\n===================[api/goods]==================')
        console.log('page: ', page)

        const goods = await this.GoodService.getGoods(page)
        return goods
    }

    @SSR('/')
    @GET('/api/goods')
    async getGoods({ query, params }) {
        const page = query?.page || 1
        const goods = await this.GoodService.getGoods(page)
        goods.pageName = 'GoodsTable'
        return goods
    }

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

    @SSR('/users/:id')
    async getGoodsForUser(ctx) {
        const { id } = ctx.params
        if (!id || id instanceof Array) {
            return {
                props: { error: true, message: 'User not found' },
            }
        }
        return await this.GoodService.getGoodsBySellerId(id)
    }
}

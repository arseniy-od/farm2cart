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

@USE([session, passportInit, passportSession])
export default class GoodController extends BaseController {
    private GoodService = this.di.GoodService
    private CategoryService = this.di.CategoryService

    @GET('/api/goods')
    async getGoodsApi() {
        const goods = await this.GoodService.getGoods()
        return goods
    }

    @SSR('/')
    async getGoods() {
        const goods = await this.GoodService.getGoods()
        const categories = await this.CategoryService.getCategories()
        return { goods, categories }
    }

    @POST('/api/goods')
    // @USE(validate(goodSchema)) // problems with form-data
    @USE(uploadMiddleware)
    async createGood({ body, identity, file }: NextApiRequestFile) {
        if (!identity) {
            return { error: true, message: 'You are not logged in' }
        }
        const goodData = { ...body, seller_id: identity.id }
        // console.log('[api/goods] goodData before: ', goodData)
        if (!(goodData.categories instanceof Array)) {
            goodData.categories = [goodData.categories]
        }
        // console.log('[api/goods] goodData after:', goodData)

        if (file) {
            goodData.imageUrl = file.path.replace('public', '')
        }
        // console.log('[api/goods] goodData: ', goodData)

        const good = await this.GoodService.createGood(goodData)
        // console.log('[api/goods] Good: ', good)
        return good
    }

    @PUT('/api/goods')
    @USE(uploadMiddleware)
    // @USE(validate(goodSchema)) // problems with form-data
    async updateGood({ body, identity, file }: NextApiRequestFile) {
        // console.log('==========[GoodController]==============')
        // console.log('Body:', body)
        if (!identity) {
            return { error: true, message: 'You are not logged in' }
        }
        const goodData = { ...body, seller_id: identity.id }
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
    async getGood({
        params,
    }: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) {
        const { id } = params
        if (!id || id instanceof Array) {
            return { notFound: true }
        }
        const good: good = await this.GoodService.getGoodByIdExtended(id)
        const categories: category[] =
            await this.CategoryService.getCategories()
        if (good.reviews) {
            good.reviews.sort(
                (a, b) =>
                    new Date(a.datepub).getTime() -
                    new Date(b.datepub).getTime()
            )
        }
        return { good, categories }
    }

    async getStaticPaths() {
        const paths = await this.GoodService.getAllGoodIds()
        return {
            paths,
            fallback: false,
        }
    }
}

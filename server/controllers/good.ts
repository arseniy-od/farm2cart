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
    good,
} from '@/app/interfaces'

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

@USE([session, passportInit, passportSession, uploadMiddleware])
export default class GoodController extends BaseController {
    private GoodService = this.di.GoodService

    @SSR('/')
    @GET('/api/goods')
    async getGoods() {
        return await this.GoodService.getGoods()
    }

    @POST('/api/goods')
    async createGood(req: NextApiRequestFile) {
        if (!req.user) {
            return { error: true, message: 'You are not logged in' }
        }
        const goodData = { ...req.body, seller_id: req.user.id }
        // console.log('[api/goods] goodData before: ', goodData)
        if (!(goodData.categories instanceof Array)) {
            goodData.categories = [goodData.categories]
        }
        // console.log('[api/goods] goodData after:', goodData)

        const file = req.file
        if (file) {
            goodData.imageUrl = file.path.replace('public', '')
        }
        // console.log('[api/goods] goodData: ', goodData)

        const good = await this.GoodService.createGood(goodData)
        // console.log('[api/goods] Good: ', good)
        return good
    }

    @PUT('api/goods')
    async updateGood(req: NextApiRequestFile) {
        // console.log('==========[GoodController]==============')

        if (!req.user) {
            return { error: true, message: 'You are not logged in' }
        }
        const goodData = { ...req.body, seller_id: req.user.id }
        // console.log('[api/goods] goodData before: ', goodData)
        if (!(goodData.categories instanceof Array)) {
            goodData.categories = [goodData.categories]
        }
        // console.log('[api/goods] goodData after:', goodData)

        const file = req.file
        if (file) {
            goodData.imageUrl = file.path.replace('public', '')
        }
        // console.log('[api/goods] goodData: ', goodData)

        const good = await this.GoodService.updateGood(goodData)
        // console.log('[api/goods] Good: ', good)
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
        query,
    }: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) {
        const { id } = query
        console.log('ctx.query: ', query)
        if (!id || id instanceof Array) {
            return { notFound: true }
        }
        const good: good = await this.GoodService.getGoodByIdExtended(id)
        if (good.reviews) {
            good.reviews.sort(
                (a, b) =>
                    new Date(a.datepub).getTime() -
                    new Date(b.datepub).getTime()
            )
        }
        return good
    }
}

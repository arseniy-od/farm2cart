import {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
    PreviewData,
} from 'next'
import BaseContext from '../baseContext'
import { NextApiRequestWithUser, good } from '@/app/interfaces'
import { ParsedUrlQuery } from 'querystring'

export default class GoodController extends BaseContext {
    private GoodService = this.di.GoodService

    async getGoods() {
        const result = await this.GoodService.getGoods()
        const goods = JSON.parse(JSON.stringify(result))
        if (!goods || !goods.length) {
            return { notFound: true }
        }
        return goods
    }

    async createGood(req: NextApiRequestWithUser) {
        if (!req.user) {
            return {
                props: {
                    user: { error: true, message: 'You are not logged in' },
                },
            }
        }
        const goodData = { ...req.body, seller_id: req.user.id }
        console.log('[api/goods] goodData before: ', goodData)
        if (!(goodData.categories instanceof Array)) {
            goodData.categories = [goodData.categories]
        }
        console.log('[api/goods] goodData after:', goodData)

        const file = req.file
        if (file) {
            goodData.imageUrl = file.path.replace('public', '')
        }
        console.log('[api/goods] goodData: ', goodData)

        const good = await this.GoodService.createGood(goodData)
        console.log('[api/goods] Good: ', good)
    }

    async deleteGood(req: NextApiRequest) {
        if (req.query.id && typeof req.query.id === 'string') {
            const good = await this.GoodService.deleteGood(req.query.id)
            return good
        } else {
            return { error: true, message: 'id not found or id is an array' }
        }
    }

    async getGood(ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) {
        const { id } = ctx.query
        if (!id || id instanceof Array) {
            return { props: { good: { notFound: true } } }
        }
        const good: good = await this.GoodService.getGoodById(id)
        if (good.reviews) {
            good.reviews.sort(
                (a, b) =>
                    new Date(a.datepub).getTime() -
                    new Date(b.datepub).getTime()
            )
        }
        return {
            props: {
                good,
            },
        }
    }
}

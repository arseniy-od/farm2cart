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
import { goodFilterSchema, goodSchema } from '../validation/schemas'

import { CODES } from '@/app/constants'
import { clientDi } from '@/redux/container'

@USE([session, passportInit, passportSession])
export default class GoodController extends BaseController {
    private GoodService = this.di.GoodService
    private CategoryService = this.di.CategoryService

    constructor(opts) {
        super(opts)
        this.schema = clientDi('GoodEntity').schema
    }

    @SSR('/')
    @SSR('/categories/:slug')
    @SSR('/users/:id')
    @GET('/api/goods')
    @USE(validate(goodFilterSchema))
    async getPaginatedGoods({ query, identity, params }) {
        const categorySlug = params?.slug || query?.categorySlug
        const page = query?.page || 1
        const searchQuery = query?.search || ''
        const currentUser = query?.currentUser
        const userId = params?.id || query?.userId
        const escapedSearchQuery = searchQuery.replace(/['"]+/g, '')

        this.createMessage({
            successMessage: 'Goods fetched',
            failMessage: 'Goods not found',
            successCode: CODES.DEBUG,
            failCode: CODES.TOAST,
        })
        const goods = await this.GoodService.getPaginatedGoodsWithFilters(
            page,
            escapedSearchQuery,
            categorySlug,
            currentUser,
            userId,
            identity?.id
        )
        return goods
    }

    @POST('/api/goods')
    // @USE(validate(goodSchema)) // problems with form-data
    @USE(uploadMiddleware)
    async createGood({ body, identity, file }: NextApiRequestFile) {
        this.createMessage({
            successMessage: 'Good created',
            failMessage: 'Error while creating good',
            successCode: CODES.TOAST,
            failCode: CODES.TOAST,
        })

        const good = await this.GoodService.createGood({ body, identity, file })
        return good
    }

    @PUT('/api/goods')
    @USE(uploadMiddleware)
    // @USE(validate(goodSchema)) // problems with form-data
    async updateGood({ body, identity, file }: NextApiRequestFile) {
        this.createMessage({
            successMessage: 'Good updated',
            failMessage: 'Error while updating good',
            successCode: CODES.TOAST,
            failCode: CODES.TOAST,
        })

        const good = await this.GoodService.updateGood({ body, identity, file })
        return good
    }

    @PATCH('/api/goods')
    @USE(uploadMiddleware)
    // @USE(validate(goodSchema)) // problems with form-data
    async updateGoodPatch({ body, identity, file, query }: NextApiRequestFile) {
        this.createMessage({
            successMessage: 'Good updated',
            failMessage: 'Error while updating good',
            successCode: CODES.TOAST,
            failCode: CODES.TOAST,
        })
        const good = await this.GoodService.patchGood({
            body,
            identity,
            file,
            query,
        })
        return good
    }

    @DELETE('/api/goods')
    async deleteGood(req: NextApiRequest) {
        this.createMessage({
            successMessage: 'Good deleted',
            failMessage: 'Error while deleting good',
            successCode: CODES.TOAST,
            failCode: CODES.TOAST,
        })

        const good = await this.GoodService.deleteGood(req.query.id)
        return good
    }

    @SSR('/goods/:id')
    async getGood({ params }) {
        const { id } = params
        this.createMessage({
            successMessage: 'Good fetched',
            failMessage: 'Good not found',
            successCode: CODES.DEBUG,
            failCode: CODES.TOAST,
        })

        return await this.GoodService.getGoodByIdExtended(id)
    }
}

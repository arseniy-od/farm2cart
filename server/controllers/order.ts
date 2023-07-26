import {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
    PreviewData,
} from 'next'
import BaseContext from '../baseContext'
import { NextApiRequestWithUser } from '@/app/types/interfaces'
import { ParsedUrlQuery } from 'querystring'
import container from '../container'

import USE from '../decorators/use'
import GET from '../decorators/get'
import POST from '../decorators/post'
import DELETE from '../decorators/delete'
import PATCH from '../decorators/patch'
import SSR from '../decorators/ssr'

import session, { passportInit, passportSession } from '@/middleware/session'
import BaseController from './baseController'
import { OrderSchema } from '../validation/schemas'
import validate from '../validation/validator'
import { goodsSchema, orderGoodsSchema } from '@/redux/normalSchemas'
import { clientDi } from '@/redux/container'

@USE([session, passportInit, passportSession])
export default class OrderController extends BaseController {
    private OrderService = this.di.OrderService

    constructor(opts) {
        super(opts)
        this.schema = clientDi('OrderEntity').schema
    }

    @SSR('/orders')
    @GET('/api/orders')
    async getOrdersForUser({ identity, query }) {
        const page = query?.page || 1
        const searchQuery = query?.search || ''
        const escapedSearchQuery = searchQuery.replace(/['"]+/g, '')
        if (!identity) {
            return { error: true, message: 'You are not logged in' }
        }
        return await this.OrderService.getOrdersByCustomerId(
            page,
            escapedSearchQuery,
            identity.id
        )
    }

    @POST('/api/orders')
    @USE(validate(OrderSchema))
    async createOrder({ body, identity, session }: NextApiRequestWithUser) {
        if (!identity) {
            return { error: true, message: 'You are not logged in' }
        }
        const OrderData = {
            ...body,
            customerId: identity.id,
            paymentStatus: 'Ok',
        }

        const order = await this.OrderService.createOrder(OrderData)
        session.cart = null
        return order
    }

    @SSR('/orders/:id')
    async getOrder({
        params,
    }: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) {
        const id = params?.id
        if (!id || id instanceof Array) {
            return { error: true, message: 'No order id or id is an array' }
        }

        let order = await this.OrderService.getOrderById(id)
        return order
    }
}

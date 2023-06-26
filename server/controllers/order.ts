import {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
    PreviewData,
} from 'next'
import BaseContext from '../baseContext'
import { NextApiRequestWithUser } from '@/app/interfaces'
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

@USE([session, passportInit, passportSession])
export default class OrderController extends BaseController {
    private OrderService = this.di.OrderService

    @SSR('/orders')
    @GET('/api/orders')
    async getOrders() {
        const result = await this.OrderService.getOrders()
        const orders = JSON.parse(JSON.stringify(result))
        if (!orders || !orders.length) {
            return { notFound: true }
        }
        return orders
    }

    @POST('/api/orders')
    async createOrder(req: NextApiRequestWithUser) {
        if (!req.user) {
            return { error: true, message: 'You are not logged in' }
        }
        const OrderData = {
            ...req.body,
            customerId: req.user.id,
            paymentStatus: 'Ok',
        }

        const order = await this.OrderService.createOrder(OrderData)
        req.session.cart = null
        return order
    }

    @SSR('/orders/:id')
    async getOrder(
        ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
    ) {
        const { id } = ctx.query
        if (!id || id instanceof Array) {
            return { error: true, message: 'No order id or id is an array' }
        }

        let order = await this.OrderService.getOrderById(id)
        order = JSON.parse(JSON.stringify(order))
        // console.log('order is: ', order)
        return order
    }
}

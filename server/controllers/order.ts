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

export default class OrderController extends BaseContext {
    private OrderService = this.di.OrderService

    async getOrders() {
        const result = await this.OrderService.getOrders()
        const orders = JSON.parse(JSON.stringify(result))
        if (!orders || !orders.length) {
            return { notFound: true }
        }
        return { orders }
    }

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

    async getOrder(
        ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
    ) {
        const { id } = ctx.query
        if (!id || id instanceof Array) {
            return { props: { order: { notFound: true } } }
        }

        let orderData = await this.OrderService.getOrderById(id)
        orderData = JSON.parse(JSON.stringify(orderData))
        console.log('orderData is: ', orderData)
        return {
            props: {
                order: orderData,
            },
        }
    }
}

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
import { orderFilterSchema, orderSchema } from '../validation/schemas'
import validate from '../validation/validator'

import { clientDi } from '@/redux/container'
import { CODES } from '@/app/constants'

@USE([session, passportInit, passportSession])
export default class OrderController extends BaseController {
    private OrderService = this.di.OrderService

    constructor(opts) {
        super(opts)
        this.schema = clientDi('OrderEntity').schema
    }

    @SSR('/orders')
    @GET('/api/orders')
    @USE(validate(orderFilterSchema))
    async getOrdersForUser({ identity, query }) {
        const page = query?.page || 1
        const searchQuery = query?.searchQuery || ''
        const escapedSearchQuery = searchQuery.replace(/['"]+/g, '')

        this.createMessage({
            successMessage: 'Orders found',
            failMessage: 'Orders not found',
            successCode: CODES.DEBUG,
            failCode: CODES.TOAST,
        })
        console.log('[OrderController] identity: ', identity)

        return await this.OrderService.getOrdersByCustomerId(
            page,
            escapedSearchQuery,
            identity?.id
        )
    }

    @POST('/api/orders')
    @USE(validate(orderSchema))
    async createOrder({ body, identity, session }: NextApiRequestWithUser) {
        this.createMessage({
            successMessage: 'Order created',
            failMessage: 'Error while creating order',
        })

        const OrderData = {
            ...body,
            customerId: identity?.id,
            paymentStatus: 'Ok',
        }
        const order = await this.OrderService.createOrder(OrderData)
        session.cart = []
        return order
    }

    @SSR('/orders/:id')
    async getOrder({
        params,
    }: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) {
        const id = params?.id
        // this.createMessage({
        //     successMessage: 'Order found',
        //     failMessage: 'Order not found',
        //     successCode: CODES.DEBUG,
        //     failCode: CODES.TOAST,
        // })
        return await this.OrderService.getOrderById(id)
    }
}

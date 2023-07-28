import { all, call, fork, put, take } from 'redux-saga/effects'

import Entity from './entity'
import { goodsSchema, orderGoodsSchema } from '../normalSchemas'
import Router from 'next/router'
import { createOrderFail, decrementQuantity } from '../actions'

import action from '../decorators/action'
export default class OrderEntity extends Entity {
    constructor(opts) {
        super(opts)
        this.fetchOrders = this.fetchOrders.bind(this)
        this.addOrder = this.addOrder.bind(this)
        this.initSchema('orders', {
            OrderGoods: [orderGoodsSchema],
            goods: goodsSchema,
        })
    }

    @action()
    *addOrder(data) {
        try {
            const result = yield call(this.saveData, '/api/orders', data)
            data.goods.forEach((good) =>
                put(decrementQuantity(good, good.quantity))
            )
            const id = result.id
            Router.push('/orders/' + id)
        } catch (error) {
            yield put(createOrderFail(error.message))
        }
    }

    @action()
    *fetchOrders({
        pageName,
        pageNumber,
        filter,
        force,
    }: {
        pageName: string
        pageNumber: number
        filter: Record<string, string>
        force?: boolean
    }) {
        let forced = force
        if (typeof filter.searchQuery === 'string') {
            forced = true
        } else {
            delete filter.searchQuery
        }
        yield call(
            this.readPaginated,
            pageName,
            '/api/orders',
            pageNumber,
            filter,
            forced
        )
    }
}

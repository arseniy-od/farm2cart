import Entity from './entity'
import { all, call, fork, put, take } from 'redux-saga/effects'
import { normalize, schema } from 'normalizr'

import action from '../decorators/action'
import { goodsSchema, orderGoodsSchema } from '../normalSchemas'
import Router from 'next/router'
import { createOrderFail, decrementQuantity } from '../actions'

class OrderEntity extends Entity {
    constructor() {
        super()
        this.orderSaga = this.orderSaga.bind(this)
        this.fetchOrders = this.fetchOrders.bind(this)
        this.addOrder = this.addOrder.bind(this)
        this.initSchema('orders', {
            OrderGoods: [orderGoodsSchema],
            goods: goodsSchema,
        })
    }

    *addOrder() {
        console.log('addOrder called')
        while (true) {
            const { payload } = yield take('saga/create_order')
            try {
                const result = yield call(this.saveData, '/api/orders', payload)
                payload.goods.forEach((good) =>
                    put(decrementQuantity(good, good.quantity))
                )
                const id = result.id
                Router.push('/orders/' + id)
            } catch (error) {
                yield put(createOrderFail(error.message))
            }
        }
    }

    *fetchOrders() {
        console.log('fetchOrders')
        while (true) {
            yield take('saga/fetch_orders')
            yield call(this.readData, '/api/orders')
        }
    }

    *orderSaga() {
        console.log('orderSaga')
        yield all([call(this.fetchOrders), call(this.addOrder)])
    }
}

const orderInstance = new OrderEntity()

export default orderInstance

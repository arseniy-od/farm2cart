import Entity from './entity'
import { all, call, fork, put, take } from 'redux-saga/effects'

import { categoryGoodSchema, goodSchema } from '../normalSchemas'
import action from '../decorators/action'

class CartEntity extends Entity {
    constructor() {
        super()
        this.cartSaga = this.cartSaga.bind(this)
        this.fetchCart = this.fetchCart.bind(this)

        this.initSchema('cartItems', {
            good: goodSchema,
        })
    }

    *fetchCart() {
        console.log('fetchCart')
        while (true) {
            yield take('saga/fetch_cart')
            yield call(this.readData, '/api/cart')
        }
    }

    *cartSaga() {
        yield all([call(this.fetchCart)])
    }
}

const cartInstance = new CartEntity()

export default cartInstance

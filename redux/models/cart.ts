import Entity from './entity'
import { all, call, fork, put, take } from 'redux-saga/effects'

import { categoryGoodSchema, goodSchema } from '../normalSchemas'
import action from '../decorators/action'
import { deleteEntity, updateEntities } from '../actions'
import { METHODS, STRATEGIES } from '@/app/constants'

class CartEntity extends Entity {
    constructor() {
        super()
        this.cartSaga = this.cartSaga.bind(this)
        this.fetchCart = this.fetchCart.bind(this)
        this.addToCart = this.addToCart.bind(this)
        this.deleteCartItem = this.deleteCartItem.bind(this)

        this.initSchema('cartItems', {
            good: goodSchema,
        })
    }

    // to avoid replacing of good entities after fetch
    *updateCartItems(cartApi) {
        const normalizedResult = this.normalizeData(cartApi)
        yield put(updateEntities(normalizedResult, STRATEGIES.MERGE))
    }

    *fetchCart() {
        console.log('fetchCart')
        while (true) {
            yield take('saga/fetch_cart')
            const result = yield call(this.fetchApi, '/api/cart', METHODS.GET)
            yield this.updateCartItems(result)
        }
    }

    *addToCart() {
        while (true) {
            const { payload } = yield take('saga/add_to_cart')
            const result = yield call(
                this.fetchApi,
                '/api/cart',
                METHODS.POST,
                {
                    goodId: payload,
                }
            )
            yield this.updateCartItems(result)
        }
    }

    *deleteCartItem() {
        while (true) {
            const { payload } = yield take('saga/delete_cart_item')
            const { goodId } = yield call(
                this.deleteData,
                `/api/cart?index=${payload.index}`
            )
            yield put(deleteEntity('cartItems', goodId))
        }
    }

    // *incrementCartGood

    *cartSaga() {
        yield all([
            call(this.fetchCart),
            call(this.addToCart),
            call(this.deleteCartItem),
        ])
    }
}

const cartInstance = new CartEntity()

export default cartInstance

import Entity from './entity'
import { all, call, fork, put, take } from 'redux-saga/effects'

import { categoryGoodSchema, goodSchema } from '../normalSchemas'
import action from '../decorators/action'
import { deleteEntity, updateEntities } from '../actions'
import { METHODS, STRATEGIES } from '@/app/constants'

export default class CartEntity extends Entity {
    constructor(opts) {
        super(opts)
        this.fetchCart = this.fetchCart.bind(this)
        this.addToCart = this.addToCart.bind(this)
        this.deleteCartItem = this.deleteCartItem.bind(this)

        this.initSchema('cartItems', {
            good: goodSchema,
        })
    }

    // to avoid replacing of good entities after fetch
    private *updateCartItems(cartApi) {
        const normalizedResult = this.normalizeData(cartApi)
        if (normalizedResult.entities?.cartItems) {
            yield put(updateEntities(normalizedResult, STRATEGIES.MERGE))
        } else {
            yield put(updateEntities({ entities: { cartItems: {} } }))
        }
    }

    @action()
    *fetchCart() {
        const result = yield call(this.fetchApi, '/api/cart', METHODS.GET)
        yield this.updateCartItems(result)
    }

    @action()
    *addToCart(goodId: number) {
        const result = yield call(this.fetchApi, '/api/cart', METHODS.POST, {
            goodId,
        })
        yield this.updateCartItems(result)
    }

    @action()
    *deleteCartItem(data) {
        const { goodId } = yield call(
            this.deleteData,
            `/api/cart?index=${data.index}`
        )
        yield put(deleteEntity('cartItems', goodId))
    }
}

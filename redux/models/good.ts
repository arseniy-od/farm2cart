import Entity from './entity'
import { all, call, fork, put, take } from 'redux-saga/effects'
import { normalize, schema } from 'normalizr'

import action from '../decorators/action'
import {
    userSchema,
    categorySchema,
    reviewSchema,
    orderGoodsSchema,
} from '../normalSchemas'
import { activateGoodRedux, deactivateGoodRedux } from '../actions'

class GoodEntity extends Entity {
    constructor() {
        super()
        this.goodSaga = this.goodSaga.bind(this)
        this.fetchGoods = this.fetchGoods.bind(this)
        this.activateGood = this.activateGood.bind(this)
        this.deactivateGood = this.deactivateGood.bind(this)
        this.initSchema('goods', {
            seller: userSchema,
            categories: [categorySchema],
            reviews: [reviewSchema],
            OrderGood: orderGoodsSchema,
        })
    }

    *activateGood() {
        while (true) {
            const { payload } = yield take('saga/activate_good')
            yield call(this.patchData, `/api/goods/?id=${payload.id}`, {})
            yield put(activateGoodRedux(payload))
        }
    }

    *deactivateGood() {
        while (true) {
            const { payload } = yield take('saga/deactivate_good')
            yield call(this.deleteData, `/api/goods/?id=${payload.id}`)
            yield put(deactivateGoodRedux(payload))
        }
    }

    *fetchGoods() {
        while (true) {
            yield take('saga/fetch_goods')
            yield call(this.readData, '/api/goods')
        }
    }

    *goodSaga() {
        yield all([
            call(this.fetchGoods),
            call(this.activateGood),
            call(this.deactivateGood),
        ])
    }
}

const goodInstance = new GoodEntity()

export default goodInstance

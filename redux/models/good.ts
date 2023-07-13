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

class GoodEntity extends Entity {
    constructor() {
        super()
        this.goodSaga = this.goodSaga.bind(this)
        this.fetchGoods = this.fetchGoods.bind(this)
        this.initSchema('goods', {
            seller: userSchema,
            categories: [categorySchema],
            reviews: [reviewSchema],
            OrderGood: orderGoodsSchema,
        })
    }

    *fetchGoods() {
        while (true) {
            yield take('saga/fetch_goods')
            yield call(this.readData, '/api/goods')
        }
    }

    *goodSaga() {
        yield all([call(this.fetchGoods)])
    }
}

const goodInstance = new GoodEntity()

export default goodInstance

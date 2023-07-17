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
import { toFormData } from '@/app/utils'
import Router from 'next/router'

class GoodEntity extends Entity {
    constructor() {
        super()
        this.goodSaga = this.goodSaga.bind(this)
        this.fetchGoods = this.fetchGoods.bind(this)
        this.activateGood = this.activateGood.bind(this)
        this.deactivateGood = this.deactivateGood.bind(this)
        this.createGood = this.createGood.bind(this)
        this.updateGood = this.updateGood.bind(this)
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

    *createGood() {
        while (true) {
            const { payload } = yield take('saga/create_good')
            console.log('VALUES:', payload)
            const data = toFormData(payload, 'post')
            const good = yield call(
                this.saveData,
                '/api/goods',
                data,
                'multipart/form-data'
            )
            Router.push('/goods/' + good.id)
        }
    }

    *updateGood() {
        while (true) {
            const { payload } = yield take('saga/update_good')
            console.log('VALUES:', payload)
            const data = toFormData(payload, 'put')
            const good = yield call(
                this.updateData,
                '/api/goods',
                data,
                'multipart/form-data'
            )
            Router.push('/goods/' + good.id)
        }
    }

    *goodSaga() {
        yield all([
            call(this.fetchGoods),
            call(this.activateGood),
            call(this.deactivateGood),
            call(this.createGood),
            call(this.updateGood),
        ])
    }
}

const goodInstance = new GoodEntity()

export default goodInstance

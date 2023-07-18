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

export default class GoodEntity extends Entity {
    constructor(opts) {
        super(opts)
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

    @action()
    *activateGood(data) {
        yield call(this.patchData, `/api/goods/?id=${data.id}`, {})
        yield put(activateGoodRedux(data))
    }

    @action()
    *deactivateGood(data) {
        yield call(this.deleteData, `/api/goods/?id=${data.id}`)
        yield put(deactivateGoodRedux(data))
    }

    @action()
    *fetchGoods() {
        yield call(this.readData, '/api/goods')
    }

    @action()
    *createGood(data) {
        const formData = toFormData(data, 'post')
        const good = yield call(
            this.saveData,
            '/api/goods',
            formData,
            'multipart/form-data'
        )
        Router.push('/goods/' + good.id)
    }

    @action()
    *updateGood(data) {
        console.log('VALUES:', data)
        const formData = toFormData(data, 'put')
        const good = yield call(
            this.updateData,
            '/api/goods',
            formData,
            'multipart/form-data'
        )
        Router.push('/goods/' + good.id)
    }
}

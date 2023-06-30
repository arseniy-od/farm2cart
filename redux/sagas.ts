import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { fetchUserApi, fetchCategoriesApi, fetchGoodsApi } from './api'

function* fetchUser(action) {
    try {
        console.log('fetchUser saga')
        const user = yield call(fetchUserApi)
        yield put({ type: 'user/fetch_success', payload: user })
    } catch (e) {
        yield put({ type: 'user/fetch_fail', payload: e.message })
    }
}

function* fetchCategories(action) {
    try {
        const categories = yield call(fetchCategoriesApi)
        yield put({ type: 'categories/fetch_success', payload: categories })
    } catch (e) {
        yield put({ type: 'categories/fetch_fail', payload: e.message })
    }
}

function* fetchGoods(action) {
    try {
        const goods = yield call(fetchGoodsApi)
        yield put({ type: 'goods/fetch_success', payload: goods })
    } catch (e) {
        yield put({ type: 'goods/fetch_fail', payload: e.message })
    }
}

function* mySaga() {
    yield takeEvery('user/fetch_request', fetchUser)
    yield takeEvery('categories/fetch_request', fetchCategories)
    yield takeEvery('goods/fetch_request', fetchGoods)
}

export default mySaga

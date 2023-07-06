import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import {
    fetchUserApi,
    fetchCategoriesApi,
    fetchGoodsApi,
    fetchOrdersApi,
    fetchMyGoodsApi,
} from './api'

function* fetchUser(action) {
    try {
        console.log('fetchUser saga')
        const user = yield call(fetchUserApi)
        if (Object.keys(user).length) {
            yield put({ type: 'user/fetch_success', payload: user })
        } else {
            yield put({ type: 'user/fetch_blank' })
        }
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

function* fetchOrders(action) {
    try {
        const orders = yield call(fetchOrdersApi)
        yield put({ type: 'orders/fetch_success', payload: orders })
    } catch (e) {
        yield put({ type: 'orders/fetch_fail', payload: e.message })
    }
}

function* fetchMyGoods(action) {
    try {
        const goods = yield call(fetchMyGoodsApi)
        yield put({ type: 'goods/fetch_my_success', payload: goods })
    } catch (e) {
        yield put({ type: 'goods/fetch_my_fail', payload: e.message })
    }
}

function* mySaga() {
    yield takeEvery('user/fetch_request', fetchUser)
    yield takeEvery('categories/fetch_request', fetchCategories)
    yield takeEvery('goods/fetch_request', fetchGoods) // not used, goods are fetched using serverSideProps
    yield takeEvery('orders/fetch_request', fetchOrders)
    yield takeEvery('goods/fetch_my_request', fetchMyGoods)
}

export default mySaga

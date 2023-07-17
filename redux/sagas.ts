// import {
//     call,
//     fork,
//     put,
//     take,
//     takeEvery,
//     takeLatest,
// } from 'redux-saga/effects'
// import { normalize } from 'normalizr'

// import {
//     // fetchUserApi,
//     // fetchCategoriesApi,
//     // fetchOrdersApi,
//     // fetchMyGoodsApi,
//     fetchApi,
// } from './api'
// import { categoriesSchema, goodsSchema, ordersSchema } from './normalSchemas'

// function* fetchUser(action) {
//     try {
//         const user = yield call(fetchUserApi)
//         if (Object.keys(user).length) {
//             yield put({ type: 'user/fetch_success', payload: user })
//         } else {
//             yield put({ type: 'user/fetch_blank' })
//         }
//     } catch (e) {
//         yield put({ type: 'user/fetch_fail', payload: e.message })
//     }
// }

// function* fetchCategories(action) {
//     try {
//         const categories = yield call(fetchCategoriesApi)
//         const normCategories = normalize(categories, categoriesSchema)
//         yield put({
//             type: 'entities/update',
//             payload: normCategories,
//         })
//     } catch (e) {
//         yield put({ type: 'categories/fetch_fail', payload: e.message })
//     }
// }

// function* fetchOrders(action) {
//     try {
//         const orders = yield call(fetchOrdersApi)
//         const normOrders = normalize(orders, ordersSchema)
//         yield put({
//             type: 'entities/update',
//             payload: normOrders,
//         })
//     } catch (e) {
//         yield put({ type: 'orders/fetch_fail', payload: e.message })
//     }
// }

// function* fetchMyGoods(action) {
//     try {
//         const goods = yield call(fetchMyGoodsApi)
//         const normGoods = normalize(goods, goodsSchema)
//         yield put({ type: 'entities/update', payload: normGoods })
//     } catch (e) {
//         yield put({ type: 'goods/fetch_my_fail', payload: e.message })
//     }
// }

// function* handleFetch(payload) {
//     try {
//         let data = yield call(fetchApi, payload.url)
//         if (payload.normalSchema) {
//             console.log('normal schema:', payload.normalSchema)
//             data = normalize(data, payload.normalSchema)
//             yield put({ type: 'entities/update', payload: data })
//         } else {
//             yield put({ type: 'user/fetch_success', payload: data.user })
//         }
//     } catch (e) {
//         yield put({ type: 'saga/fetch_fail', payload: e.message })
//     }
// }

// function* mySaga() {
//     while (true) {
//         const { payload } = yield take('saga/fetch')
//         yield fork(handleFetch, payload)
//     }
//     // yield takeEvery('saga/fetch_user', fetchUser)
//     // yield takeEvery('saga/fetch_categories', fetchCategories)
//     // yield takeEvery('saga/fetch_orders', fetchOrders)
//     // yield takeEvery('saga/fetch_my_goods', fetchMyGoods)
// }

// export default mySaga

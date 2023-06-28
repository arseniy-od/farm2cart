import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

async function fetchUserApi() {
    const res = await fetch('api/users/me')
    const data = await res.json()
    console.log('fetched user:', data.user)
    return data.user
}

function* fetchUser(action) {
    try {
        const user = yield call(fetchUserApi)
        yield put({ type: 'user/fetch_success', user })
    } catch (e) {
        yield put({ type: 'user/fetch_fail', message: e.message })
    }
}

function* mySaga() {
    yield takeEvery('user/fetch_request', fetchUser)
}

export default mySaga

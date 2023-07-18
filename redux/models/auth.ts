import Entity from './entity'
import { all, call, fork, put, take } from 'redux-saga/effects'
import { normalize, schema } from 'normalizr'

import action from '../decorators/action'
import { addUser, fetchFailed, logoutRedux, noUser } from '../actions'
import { METHODS } from '@/app/constants'
import Router from 'next/router'
import { isEmpty } from '@/app/utils'

export default class AuthEntity extends Entity {
    constructor(opts) {
        super(opts)
        // this.authSaga = this.authSaga.bind(this)
        this.createUser = this.createUser.bind(this)
        this.fetchUser = this.fetchUser.bind(this)
        this.loginUser = this.loginUser.bind(this)
        this.logoutUser = this.logoutUser.bind(this)
        this.readUser = this.readUser.bind(this)
        this.saveUser = this.saveUser.bind(this)
    }

    private *saveUser(url, user) {
        try {
            const result = yield this.fetchApi(url, METHODS.POST, user)
            yield put(addUser(result.user))
            Router.push('/')
        } catch (error) {
            yield put(fetchFailed(error.message))
        }
    }

    private *readUser(url) {
        try {
            const result = yield this.fetchApi(url, METHODS.GET)
            if (result && !isEmpty(result) && !result.error) {
                yield put(addUser(result))
            } else {
                yield put(noUser())
            }
        } catch (error) {
            yield put(fetchFailed(error.message))
        }
    }

    @action()
    *loginUser(data) {
        // while (true) {
        //     const { payload } = yield take('saga/login')
        yield call(this.saveUser, '/api/auth', data)
        // }
    }

    @action()
    *logoutUser() {
        // while (true) {
        //     yield take('saga/logout')
        yield call(this.readData, 'api/auth/logout')
        yield put(logoutRedux())
        Router.push('/')
        // }
    }

    @action()
    *createUser(data) {
        // while (true) {
        //     const { payload } = yield take('saga/create_user')
        yield call(this.saveUser, 'api/users', data)
        // }
    }

    @action()
    *fetchUser() {
        // while (true) {
        //     yield take('saga/fetch_user')
        yield call(this.readUser, '/api/users/me')
        // }
    }

    // *authSaga() {
    //     yield all([
    //         call(this.fetchUser),
    //         call(this.loginUser),
    //         call(this.logoutUser),
    //         call(this.createUser),
    //     ])
    // }
}

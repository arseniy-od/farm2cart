import Entity from './entity'
import { all, call, fork, put, take } from 'redux-saga/effects'
import { normalize, schema } from 'normalizr'

import action from '../decorators/action'
import { addUser, fetchFailed, logoutRedux, noUser } from '../actions'
import { METHODS } from '@/app/constants'
import Router from 'next/router'
import { isEmpty } from '@/app/utils'

export default class AuthEntity extends Entity<AuthEntity> {
    constructor(opts) {
        super(opts)
        // this.authSaga = this.authSaga.bind(this)
        this.createUser = this.createUser.bind(this)
        this.fetchUser = this.fetchUser.bind(this)
        this.loginUser = this.loginUser.bind(this)
        this.logoutUser = this.logoutUser.bind(this)
        this.readUser = this.readUser.bind(this)
        this.saveUser = this.saveUser.bind(this)
        // this.actions = {} as {
        //     [methodName in keyof Omit<
        //         AuthEntity,
        //         keyof Entity | 'actions'
        //     >]: string
        // }
    }
    // public actions: {
    //     [methodName in keyof Omit<AuthEntity, keyof Entity | 'actions'>]: string
    // }
    private *saveUser(url, user) {
        try {
            const result = yield call(this.fetchApi, url, METHODS.POST, user)
            console.log('saveUser result:', result)
            if (!isEmpty(result)) {
                yield put(addUser(result))
                return result
            } else {
                yield put(noUser())
                return { error: true, message: 'User not found' }
            }
        } catch (error) {
            yield put(fetchFailed(error.message))
            return { error: true, message: error.message }
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
        const result = yield call(this.saveUser, '/api/auth', data)
        console.log('RESULT: ', result)
        if (!result.error) {
            Router.push('/')
        }
    }

    @action()
    *logoutUser() {
        yield call(this.readData, 'api/auth/logout')
        yield put(logoutRedux())
        Router.push('/')
    }

    @action()
    *createUser(data) {
        yield call(this.saveUser, 'api/users', data)
        yield call(this.loginUser, data)
        Router.push('/')
    }

    @action()
    *fetchUser() {
        yield call(this.readUser, '/api/users/me')
    }
}

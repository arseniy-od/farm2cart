import Entity from './entity'
import { all, call, fork, put, take } from 'redux-saga/effects'
import { normalize, schema } from 'normalizr'

import action from '../decorators/action'
import { addUser, fetchFailed } from '../actions'
import { METHODS } from '@/app/constants'

class UserEntity extends Entity {
    constructor() {
        super()
        this.userSaga = this.userSaga.bind(this)
    }

    *userSaga() {
        yield all([])
    }
}

const userInstance = new UserEntity()

export default userInstance

import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'
import { Dispatch, Store, applyMiddleware, compose } from 'redux'

import rootReducer from './reducer'
import { entities, user } from '@/app/types/entities'
import Entity from './models/entity'
import BaseClientContext from './baseClientContext'

export default class ReduxStore extends BaseClientContext {
    public isDebug: boolean = false
    public wrapper
    private sagas

    constructor(opts) {
        super(opts)
        this.isDebug = process.env.NEXT_PUBLIC_NODE_ENV === 'development'
        this.sagas = Entity.sagas()
        this.rootSaga = this.rootSaga.bind(this)
        this.setupStore = this.setupStore.bind(this)
        this.wrapper = createWrapper(this.setupStore)
    }

    private rootSaga = function* () {
        yield all(this.sagas)
    }

    private setupStore() {
        const sagaMiddleware = createSagaMiddleware()
        const store = configureStore({
            reducer: rootReducer,
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware().concat(sagaMiddleware),
            devTools: this.isDebug,
        })

        sagaMiddleware.run(this.rootSaga)
        return store
    }
}
export type RootState = { user: user; entities: entities }

// export type AppStore = ReturnType<typeof setupStore>

// export type AppDispatch = AppStore['dispatch']

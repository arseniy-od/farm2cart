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

    constructor(opts) {
        super(opts)
        this.isDebug = process.env.NEXT_PUBLIC_NODE_ENV === 'development'
        this.setupStore = this.setupStore.bind(this)
        this.wrapper = createWrapper(this.setupStore)
    }

    // private _store: Store

    // public get store(): Store<RootState> {
    //     return this._store
    // }

    // public state = (): RootState => {
    //     return this._store.getState()
    // }

    // public dispatch = (args: any): Dispatch => {
    //     return this._store.dispatch(args)
    // }

    private rootSaga = function* () {
        const sagas = Entity.sagas()
        yield all(sagas)
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

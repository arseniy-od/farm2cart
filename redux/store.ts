import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import createSagaMiddleware from 'redux-saga'

import mySaga from './sagas'
import rootReducer from './reducer'
import { entities, user } from '@/app/types/entities'
import categoryInstance from './models/category'
import orderInstance from './models/order'
import userInstance from './models/user'
import goodInstance from './models/good'
import authInstance from './models/auth'

const sagaMiddleware = createSagaMiddleware()

export const setupStore = () => {
    const store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(sagaMiddleware),
    })
    sagaMiddleware.run(categoryInstance.categorySaga)
    sagaMiddleware.run(orderInstance.orderSaga)
    sagaMiddleware.run(authInstance.authSaga)
    sagaMiddleware.run(goodInstance.goodSaga)
    return store
}

export const wrapper = createWrapper<AppStore>(setupStore)
export type RootState = { user: user; entities: entities }
export type AppStore = ReturnType<typeof setupStore>

export type AppDispatch = AppStore['dispatch']

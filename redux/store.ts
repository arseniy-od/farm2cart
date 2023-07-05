import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import createSagaMiddleware from 'redux-saga'
import {
    nextReduxCookieMiddleware,
    wrapMakeStore,
} from 'next-redux-cookie-wrapper'

import mySaga from './sagas'
import rootReducer from './reducer'
// import userReducer from './features/user/userSlice'
// import categoryReducer from './features/category/categorySlice'

const sagaMiddleware = createSagaMiddleware()

export const setupStore = () => {
    const store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(sagaMiddleware),
    })
    sagaMiddleware.run(mySaga)
    return store
}

export const wrapper = createWrapper<AppStore>(setupStore)
export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>

export type AppDispatch = AppStore['dispatch']

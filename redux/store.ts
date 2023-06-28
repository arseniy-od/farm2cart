import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import createSagaMiddleware from 'redux-saga'
import mySaga from './sagas'
import userReducer from './reducers'

const sagaMiddleware = createSagaMiddleware()

export const setupStore = () => {
    const store = configureStore({
        reducer: userReducer,
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

// const sagaMiddleware = createSagaMiddleware()

// const store = configureStore({
//     reducer: userReducer,
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware().concat(sagaMiddleware),
// })

// sagaMiddleware.run(mySaga)

// export default store

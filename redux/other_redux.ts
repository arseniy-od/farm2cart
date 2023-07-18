// import { createStore, applyMiddleware, compose, Store, Dispatch } from 'redux'
// import createSagaMiddleware from 'redux-saga'
// import { all } from 'redux-saga/effects'

// import BaseContext from 'src/BaseContext'
// import rootReducer from 'src/store/reducer'
// import Entity from 'src/models/entity'
// import { PersistPartial } from 'redux-persist/es/persistReducer'
// import { AppState, ENTITY } from 'src/constants'

// export default class ReduxStore extends BaseContext {
//     private _store: Store
//     private _persistor: Persistor | null

//     public get store(): Store<AppState> {
//         return this._store
//     }

//     public get persistor(): Persistor | null {
//         return this._persistor
//     }

//     public state = (): AppState => {
//         return this._store.getState()
//     }

//     public dispatch = (args: any): Dispatch => {
//         return this._store.dispatch(args)
//     }

//     constructor(opts: any) {
//         super(opts)
//         this._persistedReducer = persistReducer(persistConfig, rootReducer)
//         const isDebug =
//             process.env.NODE_ENV === 'development' ||
//             process.env.DEBUG_PROD === 'true'
//         if (!isDebug) {
//             const { store, persistor } = this.configureProdStore()
//             this._store = store
//             this._persistor = persistor
//         } else {
//             const { store, persistor } = this.configureDevStore()
//             this._store = store
//             this._persistor = persistor
//         }
//     }

//     public rootSaga = function* root() {
//         // console.log('rootSaga', Entity.saga);
//         yield all(Entity.saga)
//     }

//     private configureProdStore(initialState?: AppState & PersistPartial) {
//         const sagaMiddleware = createSagaMiddleware()

//         // Create Store
//         const store: Store<AppState> = createStore(
//             this._persistedReducer,
//             initialState,
//             applyMiddleware(sagaMiddleware)
//         )
//         const persistor: Persistor = persistStore(store)
//         sagaMiddleware.run(this.rootSaga)
//         return { store, persistor }
//     }

//     private configureDevStore = (initialState?: AppState & PersistPartial) => {
//         const middleware = []
//         const enhancers = []

//         const sagaMiddleware = createSagaMiddleware()
//         middleware.push(sagaMiddleware)

//         const composeEnhancers = window.REDUX_DEVTOOLS_EXTENSION_COMPOSE
//             ? window.REDUX_DEVTOOLS_EXTENSION_COMPOSE({
//                   // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
//               })
//             : compose
//         enhancers.push(applyMiddleware(...middleware))
//         const enhancer = composeEnhancers(...enhancers)
//         const store: Store<AppState> = createStore(
//             this._persistedReducer,
//             initialState,
//             enhancer
//         )
//         const persistor: Persistor = persistStore(store)

//         sagaMiddleware.run(this.rootSaga)
//         return { store, persistor }
//     }
// }

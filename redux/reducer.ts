import { CombinedState, combineReducers } from 'redux'
import userReducer from './features/user/userSlice'
import categoriesReducer from './features/category/categorySlice'
import goodsReducer, { goodState } from './features/good/goodSlice'
import { HYDRATE } from 'next-redux-wrapper'
import { diff, patch } from 'jsondiffpatch'
import ordersReducer, { orderState } from './features/order/orderSlice'
import entitiesReducer from './entities/entityReducer'

const combinedReducer = combineReducers({
    user: userReducer,
    entities: entitiesReducer,
})

const rootReducer = (
    state: CombinedState<{
        user: any
        entities: any
    }>,
    action
) => {
    if (action.type === HYDRATE) {
        // const stateDiff = diff(state, action.payload) as any
        // const nextState = JSON.parse(JSON.stringify(state))
        // console.log('State:', nextState)
        // patch(nextState, stateDiff)
        // const wasBumpedOnClient = stateDiff?.page?.[0]?.endsWith('X') // or any other criteria
        // console.log('Diff:', stateDiff)
        // console.log('Next State:', nextState)

        const hydratedState = action.payload
        const nextState = {}
        for (const [key, value] of Object.entries(hydratedState)) {
            if (value instanceof Object && Object.keys(value).length) {
                nextState[key] = value
            }
        }
        return { ...state, ...nextState }
    } else {
        return combinedReducer(state, action)
    }
}

export default rootReducer

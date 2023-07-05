import { combineReducers } from 'redux'
import userReducer from './features/user/userSlice'
import categoriesReducer from './features/category/categorySlice'
import goodsReducer from './features/good/goodSlice'
import { HYDRATE } from 'next-redux-wrapper'
import { diff, patch } from 'jsondiffpatch'

const combinedReducer = combineReducers({
    user: userReducer,
    categories: categoriesReducer,
    goods: goodsReducer,
})

const rootReducer = (state, action) => {
    if (action.type === HYDRATE) {
        // const stateDiff = diff(state, action.payload) as any
        // const nextState = JSON.parse(JSON.stringify(state))
        // console.log('State:', nextState)
        // patch(nextState, stateDiff)
        // const wasBumpedOnClient = stateDiff?.page?.[0]?.endsWith('X') // or any other criteria
        // console.log('Diff:', stateDiff)
        // console.log('Next State:', nextState)

        const hydrateState = action.payload
        const nextState = JSON.parse(JSON.stringify(state))
        for (const [key, value] of Object.entries(hydrateState)) {
            if (value instanceof Object && Object.keys(value).length) {
                nextState[key] = value
            }
        }
        return nextState
    } else {
        return combinedReducer(state, action)
    }
}

export default rootReducer

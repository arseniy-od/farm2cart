import { CombinedState, combineReducers } from 'redux'
import userReducer from './features/user/userSlice'
import categoriesReducer from './features/category/categorySlice'
import goodsReducer, { goodState } from './features/good/goodSlice'
import { HYDRATE } from 'next-redux-wrapper'
import { diff, patch } from 'jsondiffpatch'
import ordersReducer, { orderState } from './features/order/orderSlice'
import entitiesReducer from './entities/entityReducer'
import { isEmpty, jsonCopy } from '@/app/utils'
import _ from 'lodash'

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
        const nextState: { [key: string]: any; entities?: any } = {}
        for (const [key, value] of Object.entries(hydratedState)) {
            if (value instanceof Object && Object.keys(value).length) {
                nextState[key] = value
            }
        }
        console.log('NextState1: ', nextState)
        if (hydratedState && hydratedState.entities) {
            nextState.entities = jsonCopy(state.entities)
            const { entities } = hydratedState
            if (!isEmpty(entities)) {
                Object.keys(entities).map((entityName) => {
                    let entityList = nextState[entityName]
                    // console.log('[previous state] entityList:', entityList)
                    if (entityList && !isEmpty(entityList)) {
                        Object.keys(entities[entityName]).map(
                            (id) => (entityList = delete entityList[id])
                        )
                    }
                })
                nextState.entities = _.merge(nextState.entities, entities)
                // console.log('Next state: ', nextState)

                // to prevent infinite loop of useEffect calls
                if (_.isEqual(state.entities, nextState.entities)) {
                    nextState.entities = state.entities
                }
            }
        }
        return { ...state, ...nextState }
    } else {
        return combinedReducer(state, action)
    }
}

export default rootReducer

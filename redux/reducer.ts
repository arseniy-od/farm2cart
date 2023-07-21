import { CombinedState, combineReducers } from 'redux'
import userReducer from './features/user/userSlice'
import { HYDRATE } from 'next-redux-wrapper'
import entitiesReducer from './features/entities/entityReducer'
import { isEmpty, jsonCopy } from '@/app/utils'
import _ from 'lodash'
import { user } from '@/app/types/interfaces'
import { entities } from '@/app/types/entities'
import pagination from './features/pagination/paginationReducer'

const combinedReducer = combineReducers({
    user: userReducer,
    entities: entitiesReducer,
    pagination: pagination,
})

const rootReducer = (
    state: CombinedState<{
        user: user
        entities: entities
    }>,
    action
) => {
    if (action.type === HYDRATE) {
        const hydratedState = action.payload
        const nextState: { [key: string]: any; entities?: any } = {}

        // adding not normalized fields
        for (const [key, value] of Object.entries(hydratedState)) {
            if (value instanceof Object && Object.keys(value).length) {
                nextState[key] = value
            }
        }

        // replacing entities with new ones by id
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

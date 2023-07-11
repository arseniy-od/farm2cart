import _ from 'lodash'

import { isEmpty, jsonCopy } from '@/app/utils'

const initialState = {}

export default function entitiesReducer(state = initialState, action) {
    switch (action.type) {
        case 'entities/update': {
            if (action.payload && action.payload.entities) {
                let nextState = jsonCopy(state)
                const { entities } = action.payload
                if (!isEmpty(entities)) {
                    Object.keys(entities).map((entityName) => {
                        let entityList = nextState[entityName]
                        // console.log('[previous state] entityList:', entityList)
                        if (entityList && !isEmpty(entityList)) {
                            Object.keys(entities[entityName]).map((id) => {
                                delete entityList[id]
                            })
                        }
                    })
                    nextState = _.merge(nextState, entities)

                    // to prevent infinite loop of useEffect calls
                    if (_.isEqual(state, nextState)) {
                        return state
                    }
                    return nextState
                }
            }
        }
        case 'entities/update_one': {
            if (action.payload) {
                const { entityName, entityId, entityFields } = action.payload
                const entity = state[entityName][entityId]
                const updatedEntity = { ...entity, ...entityFields }
                const nextEntityList = { ...state[entityName], updatedEntity }
                return { ...state, nextEntityList }
            }
        }

        default:
            return state
    }
}
//  { goods: {}
//    users: {}
//  }

// entityName, entityId, entityFields
// "goods", 5, active: true

import _ from 'lodash'

import { isEmpty, jsonCopy } from '@/app/utils'
import { STRATEGIES } from '@/app/constants'
import { entities } from '@/app/types/entities'

const initialState: entities = {}

export default function entitiesReducer(state = initialState, action) {
    switch (action.type) {
        case 'entities/update':
            {
                if (action.payload && action.payload.entities) {
                    let nextState = jsonCopy(state)
                    const { entities } = action.payload
                    if (!isEmpty(entities)) {
                        Object.keys(entities).map((entityName) => {
                            let entityList = nextState[entityName]
                            // console.log('[previous state] entityList:', entityList)
                            if (
                                entityList &&
                                !isEmpty(entityList) &&
                                !(action.payload.strategy === STRATEGIES.MERGE)
                            ) {
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
                return state
            }
            break
        case 'entities/update_one':
            {
                console.log('Update one')
                if (action.payload) {
                    const { entityName, entityId, entityFields } =
                        action.payload
                    if (!state[entityName] || !state[entityName][entityId]) {
                        return state
                    }
                    const entity = state[entityName][entityId]
                    const updatedEntity = { ...entity, ...entityFields }
                    const nextEntityList = {
                        ...state[entityName],
                        [entityId]: updatedEntity,
                    }
                    const nextState = { ...state, [entityName]: nextEntityList }
                    return nextState
                }
            }
            break
        case 'entities/update_array_field':
            {
                console.log('Update array field')
                if (action.payload) {
                    const {
                        entityName,
                        entityId,
                        entityField,
                        data,
                    }: {
                        entityName: string
                        entityId: number
                        entityField: string
                        data: any
                    } = action.payload
                    if (!state[entityName] || !state[entityName][entityId]) {
                        return state
                    }
                    const entity = state[entityName][entityId]
                    const field = entity[entityField]
                    const updatedField = [...field, data]
                    const updatedEntity = {
                        ...entity,
                        [entityField]: updatedField,
                    }
                    const nextEntityList = {
                        ...state[entityName],
                        [entityId]: updatedEntity,
                    }
                    const nextState = { ...state, [entityName]: nextEntityList }
                    return nextState
                }
            }
            break
        case 'entities/delete':
            {
                if (action.payload) {
                    const { entityName, entityId } = action.payload
                    const entityList = state[entityName]
                    let { [entityId]: omit, ...res } = entityList
                    return {
                        ...state,
                        [entityName]: res,
                    }
                }
            }
            break
        case 'entities/clear':
            {
                if (action.payload && typeof action.payload === 'string') {
                    const entityName: string = action.payload
                    let { [entityName]: omit, ...nextState } = state
                    return nextState
                }
            }
            break
        default:
            return state
    }
}

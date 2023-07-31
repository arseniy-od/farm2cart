import _ from 'lodash'

import { isEmpty, jsonCopy } from '@/app/utils'
import { ACTIONS, STRATEGIES } from '@/app/constants'
import { entities } from '@/app/types/entities'
import { Action } from '@/redux/actions'

const initialState: entities = {}

export default function entitiesReducer(state = initialState, action: Action) {
    switch (action.type) {
        case ACTIONS.UPDATE_ENTITIES: {
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

        // to change one or more fields in one entity
        case ACTIONS.UPDATE_ENTITY:
            {
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

        // to add some more ids to array of ids, e. g. good.reviews: [1, 2, 3] => good.reviews: [1, 2, 3, 4]
        case ACTIONS.ENTITY_UPDATE_ARRAY_FIELD:
            {
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

        // deletes one instance by id
        case ACTIONS.DELETE_ONE_ENTITY:
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

        // deletes all entities of same type by entity name
        case ACTIONS.CLEAR_ENTITY:
            {
                if (action.payload) {
                    const entityName: keyof entities = action.payload
                    let { [entityName]: omit, ...nextState } = state
                    return nextState
                }
            }
            break
        default:
            return state
    }
}

import _ from 'lodash'

import { isEmpty, jsonCopy } from '@/app/utils'

const initialState = {}

export default function entitiesReducer(state = initialState, action) {
    switch (action.type) {
        case 'entities/update': {
            console.log('\n\n==========UPDATE=================')
            console.log('Payload: ', action.payload)
            if (action.payload && action.payload.entities) {
                let nextState = jsonCopy(state)
                const { entities } = action.payload
                if (!isEmpty(entities)) {
                    Object.keys(entities).map((entityName) => {
                        let entityList = nextState[entityName]
                        console.log('[previous state] entityList:', entityList)
                        if (entityList && !isEmpty(entityList)) {
                            Object.keys(entities[entityName]).map(
                                (id) => (entityList = delete entityList[id])
                            )
                        }
                    })
                    nextState = _.merge(nextState, entities)
                    console.log('Next state: ', nextState)

                    // to prevent infinite loop of useEffect calls
                    if (_.isEqual(state, nextState)) {
                        return state
                    }
                    return nextState
                }
            }
        }
        default:
            return state
    }
}

function entities(state, action: any) {
    if ('globalCrud' in action) {
        const { globalCrud } = action
        switch (globalCrud) {
            case 'DELETE': {
                if (action.response && action.response.entities) {
                    let entityList = state.get(entity.entityName)
                    if (entityList) {
                        entityList = entityList.remove(action.data.id)
                        const nextState = state.set(
                            entity.entityName,
                            entityList
                        )
                        return nextState
                    }
                }
            }

            case 'UPDATE':
                if (action.response && action.response.entities) {
                    const {
                        response: { entities },
                    } = action
                    if (!isEmpty(entities)) {
                        Object.keys(entities).map((entityName) => {
                            let entityList = state[entityName]
                            if (entityList && !isEmpty(entityList)) {
                                Object.keys(entities[entityName]).map(
                                    (id) => (entityList = entityList.filter(id))
                                )
                            }
                            const nextState = { ...entityList, entityName }
                            return _.merge(nextState, entities)
                        })
                    }
                }
                break
        }
    }
    return state
}

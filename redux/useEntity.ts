import { Dispatch, useContext } from 'react'
import ContainerContext from './ContainerContext'
import { useDispatch } from 'react-redux'
import { IClientContextContainer } from './container'
import ReduxStore from './store'
import { IEntityContainer } from './models'
import { Action, action } from './actions'

export default function useEntity<T extends keyof IEntityContainer>(
    entityName: T
) {
    const di = useContext(ContainerContext)
    return di(entityName)
}

type dispatchType = Dispatch<Action>

export function useActions<T extends keyof IEntityContainer>(entityName: T) {
    const dispatch = useDispatch()
    const entity = useEntity(entityName)
    const actions = entity.actions as IEntityContainer[T]['actions']
    const dispatches: {
        [key in keyof typeof actions]: (data: any) => Action
    } = {} as any
    for (const key in actions) {
        dispatches[key] = (data: any) => dispatch(action(actions[key], data))
    }
    return dispatches
}

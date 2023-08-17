import { Dispatch, useContext } from 'react'
import ContainerContext from './ContainerContext'
import { useDispatch } from 'react-redux'
import { IClientContextContainer } from './container'
import ReduxStore from './store'
import { IEntityContainer } from './models'
import { Action, action } from './actions'

export default function useEntity(entityName: keyof IEntityContainer) {
    const di = useContext(ContainerContext)
    return di(entityName)
}

type dispatchType = Dispatch<Action>

export function useActions(entityName: keyof IEntityContainer) {
    const dispatch = useDispatch()
    const entity = useEntity(entityName)
    const actions =
        entity.actions as IEntityContainer[typeof entityName]['actions']
    const dispatches: {
        [key in keyof typeof actions]: (
            data: Parameters<IEntityContainer[typeof entityName][key]>[0]
        ) => Action
    } = {} as any
    for (const key in actions) {
        dispatches[key] = (data: any) => dispatch(action(actions[key], data))
    }
    return dispatches
}

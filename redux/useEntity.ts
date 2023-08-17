import { useContext } from 'react'
import ContainerContext from './ContainerContext'
import { useDispatch } from 'react-redux'
import { IEntityContainer } from './models'
import { Action, action } from './actions'

export default function useEntity<T extends keyof IEntityContainer>(
    entityName: T
) {
    const di = useContext(ContainerContext)
    return di(entityName)
}

export function useActions<T extends keyof IEntityContainer>(entityName: T) {
    const dispatch = useDispatch()
    const entity = useEntity(entityName)
    const actions = entity.actions as IEntityContainer[T]['actions']
    type MyParameters<T> = T extends (...args: infer P) => any ? P : never // removed check for function
    const dispatches: {
        [key in keyof typeof actions]: (
            data: MyParameters<IEntityContainer[T][key]>[0]
        ) => Action
    } = {} as any
    for (const key in actions) {
        dispatches[key] = (data: any) =>
            dispatch(action(actions[key] as string, data))
    }
    return dispatches
}

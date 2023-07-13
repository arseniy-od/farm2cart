import 'reflect-metadata'
import Entity from '../models/entity'

export default function action(): (
    target: object,
    propertyKey: string
) => void {
    return (target: object, methodName: string): void => {
        let sagas: any = Reflect.getMetadata('sagas', Entity) || []
        sagas.push({ className: target.constructor.name, methodName })
        Reflect.defineMetadata('sagas', sagas, Entity)
    }
}

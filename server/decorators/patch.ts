import 'reflect-metadata'

export default function PATCH(
    routeName: string = '*'
): (target: object, propertyKey: string) => void {
    return (target: object, propertyKey: string): void => {
        let properties: any = Reflect.getMetadata(routeName, target)
        if (Array.isArray(properties?.PATCH)) {
            properties.PATCH.push(propertyKey)
        } else {
            properties = { ...properties, PATCH: [propertyKey] }
            Reflect.defineMetadata(routeName, properties, target)
        }
    }
}

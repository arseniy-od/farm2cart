import 'reflect-metadata'

export default function SSR(
    routeName: string = '*'
): (target: object, propertyKey: string) => void {
    return (target: object, propertyKey: string): void => {
        let properties: any = Reflect.getMetadata(routeName, target)
        if (Array.isArray(properties?.SSR)) {
            properties.SSR.push(propertyKey)
        } else {
            properties = { ...properties, SSR: [propertyKey] }
            Reflect.defineMetadata(routeName, properties, target)
        }
    }
}

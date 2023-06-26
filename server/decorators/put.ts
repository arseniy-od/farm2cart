import 'reflect-metadata'

export default function PUT(
    routeName: string = '*'
): (target: object, propertyKey: string) => void {
    return (target: object, propertyKey: string): void => {
        let properties: any = Reflect.getMetadata(routeName, target)
        if (Array.isArray(properties?.PUT)) {
            properties.PUT.push(propertyKey)
        } else {
            properties = { ...properties, PUT: [propertyKey] }
            Reflect.defineMetadata(routeName, properties, target)
        }
    }
}

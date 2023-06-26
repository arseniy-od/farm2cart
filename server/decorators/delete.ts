import 'reflect-metadata'

export default function DELETE(
    routeName: string = '*'
): (target: object, propertyKey: string) => void {
    return (target: object, propertyKey: string): void => {
        let properties: any = Reflect.getMetadata(routeName, target)
        if (Array.isArray(properties?.DELETE)) {
            properties.DELETE.push(propertyKey)
        } else {
            properties = { ...properties, DELETE: [propertyKey] }
            Reflect.defineMetadata(routeName, properties, target)
        }
    }
}

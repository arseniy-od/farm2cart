import 'reflect-metadata'

export default function POST(
    routeName: string = '*'
): (target: object, propertyKey: string) => void {
    return (target: object, propertyKey: string): void => {
        let properties: any = Reflect.getMetadata(routeName, target)
        if (Array.isArray(properties?.POST)) {
            properties.POST.push(propertyKey)
        } else {
            properties = { ...properties, POST: [propertyKey] }
            Reflect.defineMetadata(routeName, properties, target)
        }
    }
}

import { IEntityContainer } from '@/redux/models'

export interface ISagaMethods {
    className: keyof IEntityContainer
    methodName: string
}

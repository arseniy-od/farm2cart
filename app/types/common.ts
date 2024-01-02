import { IEntityContainer } from '@/redux/models'

export interface ISagaMethod {
    className: keyof IEntityContainer
    methodName: string
}

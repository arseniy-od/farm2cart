import { IClientContextContainer } from './container'

export default class BaseClientContext {
    protected di: IClientContextContainer

    constructor(opts: IClientContextContainer) {
        this.di = opts
    }
}

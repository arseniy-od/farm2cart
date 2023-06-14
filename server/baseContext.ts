export interface IContextContainer {
    [key: string]: any;
}

export default class BaseContext {
    protected di: IContextContainer;

    constructor(opts: IContextContainer) {
        this.di = opts;
    }
}
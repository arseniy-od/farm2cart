import Entity from './entity'

export default class UserEntity extends Entity {
    constructor(opts) {
        super(opts)
        this.initSchema('users')
    }
}

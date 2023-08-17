import Entity from './entity'

export default class UserEntity extends Entity<UserEntity> {
    constructor(opts) {
        super(opts)
        this.initSchema('users')
        // this.actions = {} as {
        //     [methodName in keyof Omit<
        //         UserEntity,
        //         keyof Entity | 'actions'
        //     >]: string
        // }
    }
    // public actions: {
    //     [methodName in keyof Omit<UserEntity, keyof Entity | 'actions'>]: string
    // }
}

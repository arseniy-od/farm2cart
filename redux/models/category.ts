import Entity from './entity'
import { all, call, fork, put, take } from 'redux-saga/effects'

import { categoryGoodSchema, goodSchema } from '../normalSchemas'
import action from '../decorators/action'

export default class CategoryEntity extends Entity {
    constructor(opts) {
        super(opts)
        this.fetchCategories = this.fetchCategories.bind(this)

        this.initSchema('categories', {
            CategoryGood: categoryGoodSchema,
            goods: [goodSchema],
        })
        this.actions = {} as {
            [methodName in keyof Omit<
                CategoryEntity,
                keyof Entity | 'actions'
            >]: string
        }
    }
    public actions: {
        [methodName in keyof Omit<
            CategoryEntity,
            keyof Entity | 'actions'
        >]: string
    };

    @action()
    *fetchCategories() {
        yield call(this.readData, '/api/categories')
    }
}

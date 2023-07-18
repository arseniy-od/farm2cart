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
    }

    @action()
    *fetchCategories() {
        yield call(this.readData, '/api/categories')
    }
}

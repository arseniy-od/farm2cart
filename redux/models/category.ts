import BaseEntity from './entity'
import { call } from 'redux-saga/effects'
import { schema } from 'normalizr'

import action from '../decorators/action'

export default class CategoryEntity extends BaseEntity {
    constructor() {
        super()
        this.initSchema('stores', {
            user: new schema.Entity('users'),
            review: [new schema.Entity('reviews')],
            product: [new schema.Entity('products')],
        })
    }

    @action() // writes to 'sagas' metadata
    protected *fetchCategories() {
        yield call(this.readData, '/api/categories')
    }

    @action()
    protected *fetchCategoryBySlug(data) {
        yield call(this.readData, `/api/categories/${data.payload}`)
    }
}

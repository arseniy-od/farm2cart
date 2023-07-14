import Entity from './entity'
import { all, call, fork, put, take } from 'redux-saga/effects'

import { categoryGoodSchema, goodSchema } from '../normalSchemas'
import action from '../decorators/action'

class CategoryEntity extends Entity {
    constructor() {
        super()
        this.categorySaga = this.categorySaga.bind(this)
        this.fetchCategories = this.fetchCategories.bind(this)

        this.initSchema('categories', {
            CategoryGood: categoryGoodSchema,
            goods: [goodSchema],
        })
    }

    *fetchCategories() {
        console.log('fetchCategories')
        while (true) {
            yield take('saga/fetch_categories')
            yield call(this.readData, '/api/categories')
        }
    }

    *categorySaga() {
        console.log('categorySaga')
        yield all([call(this.fetchCategories)])
    }
}

const categoryInstance = new CategoryEntity()

export default categoryInstance

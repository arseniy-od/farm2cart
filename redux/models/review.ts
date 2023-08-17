import { all, call, fork, put, take } from 'redux-saga/effects'

import Entity from './entity'
import { userSchema } from '../normalSchemas'
import action from '../decorators/action'
import { updateEntityArrayField } from '../actions'

export default class ReviewEntity extends Entity {
    constructor(opts) {
        super(opts)
        this.addReview = this.addReview.bind(this)
        this.initSchema('reviews', { author: userSchema })
        this.actions = {} as {
            [methodName in keyof Omit<
                ReviewEntity,
                keyof Entity | 'actions'
            >]: string
        }
    }
    public actions: {
        [methodName in keyof Omit<
            ReviewEntity,
            keyof Entity | 'actions'
        >]: string
    };
    @action()
    *addReview(data) {
        const review = yield call(this.saveData, '/api/reviews', data.review)
        yield put(
            updateEntityArrayField({
                entityName: 'goods',
                entityId: data.goodId,
                entityField: 'reviews',
                data: review.id,
            })
        )
    }
}

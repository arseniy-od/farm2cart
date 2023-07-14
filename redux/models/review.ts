import { all, call, fork, put, take } from 'redux-saga/effects'

import Entity from './entity'
import { userSchema } from '../normalSchemas'
import action from '../decorators/action'
import { updateEntityArrayField } from '../actions'

class ReviewEntity extends Entity {
    constructor() {
        super()
        this.reviewSaga = this.reviewSaga.bind(this)
        this.addReview = this.addReview.bind(this)
        this.initSchema('reviews', { author: userSchema })
    }

    *addReview() {
        console.log('addReview called')
        while (true) {
            const { payload } = yield take('saga/create_review')
            const review = yield call(
                this.saveData,
                '/api/reviews',
                payload.review
            )
            yield put(
                updateEntityArrayField({
                    entityName: 'goods',
                    entityId: payload.goodId,
                    entityField: 'reviews',
                    data: review.id,
                })
            )
        }
    }

    *reviewSaga() {
        yield all([call(this.addReview)])
    }
}

const reviewInstance = new ReviewEntity()

export default reviewInstance

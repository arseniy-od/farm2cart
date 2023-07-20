import { NextApiRequest, NextApiResponse } from 'next'
import BaseContext from '../baseContext'
import { NextApiRequestWithUser } from '@/app/types/interfaces'

import USE from '../decorators/use'
import GET from '../decorators/get'
import POST from '../decorators/post'
import DELETE from '../decorators/delete'
import PATCH from '../decorators/patch'
import SSR from '../decorators/ssr'

import session, { passportInit, passportSession } from '@/middleware/session'
import BaseController from './baseController'
import { reviewSchema } from '../validation/schemas'
import validate from '../validation/validator'
import { userSchema } from '@/redux/normalSchemas'

@USE([session, passportInit, passportSession])
export default class ReviewController extends BaseController {
    private ReviewService = this.di.ReviewService

    constructor(opts) {
        super(opts)
        this.initSchema('reviews', { author: userSchema })
    }

    @GET('/api/reviews')
    async getReviews() {
        return await this.ReviewService.getReviews()
    }

    @POST('/api/reviews')
    @USE(validate(reviewSchema))
    async createReview({ body, identity }: NextApiRequestWithUser) {
        if (!identity) {
            return { error: true, message: 'You are not logged in' }
        }
        const reviewData = {
            ...body,
            authorId: identity.id,
            score: parseInt(body.score),
        }
        return await this.ReviewService.createReview(reviewData)
    }
}

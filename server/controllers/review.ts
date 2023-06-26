import { NextApiRequest, NextApiResponse } from 'next'
import BaseContext from '../baseContext'
import { NextApiRequestWithUser } from '@/app/interfaces'

import USE from '../decorators/use'
import GET from '../decorators/get'
import POST from '../decorators/post'
import DELETE from '../decorators/delete'
import PATCH from '../decorators/patch'
import SSR from '../decorators/ssr'

import session, { passportInit, passportSession } from '@/middleware/session'
import BaseController from './baseController'

@USE([session, passportInit, passportSession])
export default class ReviewController extends BaseController {
    private ReviewService = this.di.ReviewService

    @GET('/api/reviews')
    async getReviews() {
        return await this.ReviewService.getReviews()
    }

    @POST('/api/reviews')
    async createReview(req: NextApiRequestWithUser) {
        if (!req.user) {
            return { error: true, message: 'You are not logged in' }
        }
        const reviewData = {
            ...req.body,
            authorId: req.user.id,
            score: parseInt(req.body.score),
        }
        const review = await this.ReviewService.createReview(reviewData)
        return review
    }
}

import { NextApiRequest, NextApiResponse } from 'next'
import BaseContext from '../baseContext'
import { NextApiRequestWithUser } from '@/app/interfaces'

export default class ReviewController extends BaseContext {
    private ReviewService = this.di.ReviewService

    async getReviews() {
        const result = await this.ReviewService.getReviews()
        const reviews = JSON.parse(JSON.stringify(result))
        if (!reviews || !reviews.length) {
            return { notFound: true }
        }
        return { reviews }
    }

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

import { review } from '@/app/types/interfaces'
import BaseContext from '../baseContext'

export default class ReviewService extends BaseContext {
    private Good = this.di.Good
    private User = this.di.User
    private Review = this.di.Review
    private Category = this.di.Category
    private Order = this.di.Order

    async getReviews() {
        return await this.Review.findAll({
            include: [
                {
                    attributes: ['username', 'email'],
                    model: this.User,
                    as: 'author',
                },
                {
                    attributes: ['id', 'title'],
                    model: this.Good,
                    as: 'good',
                },
            ],
        })
    }

    async getReviewById(id: string | number) {
        return await this.Review.findOne({
            where: { id },
            attributes: ['text', 'score', 'datepub'],
            include: [
                {
                    attributes: ['username', 'email'],
                    model: this.User,
                    as: 'author',
                },
                {
                    attributes: ['id', 'title'],
                    model: this.Good,
                    as: 'good',
                },
            ],
        })
    }

    async createReview(reviewData: review) {
        return await this.Review.create(reviewData)
    }
}

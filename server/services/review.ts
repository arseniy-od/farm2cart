import {User, Review, Good, Order, OrderGood, Category, CategoryGood, Company} from '@/server/database/models'


export async function getReviews() {
    return await Review.findAll(
        {
            include: [
                {
                    attributes: ['username', 'email'],
                    model: User,
                    as: 'author'
                },
                {
                    attributes: ['id', 'title'],
                    model: Good,
                    as: 'good'
                }

            ]
        }
    );
}


export async function getReviewById(id) {
    return await Review.findOne(
        {
            where: {id},
            attributes: ['text', 'score', 'datepub'],
            include: [
                {
                    attributes: ['username', 'email'],
                    model: User,
                    as: 'author'
                },
                {
                    attributes: ['id', 'title'],
                    model: Good,
                    as: 'good'
                }

            ]
        }
    );
}



export async function createReview(reviewData) {
    const result = await Review.create(reviewData);
    return await getReviewById(result.id)
}


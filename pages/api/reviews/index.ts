import {Good, User, Review} from '@/database/models/index'


async function handler(req, res) {
    const {query: { nextPage }, method, body,} = req;

    const reviews = await Review.findAll(
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

    res.statusCode = 200;
    res.json(reviews);
}

export default handler;
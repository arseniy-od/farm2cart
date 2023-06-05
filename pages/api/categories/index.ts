import {Category, Good, CategoryGood} from '@/database/models/index'


async function handler(req, res) {
    const {query: { nextPage }, method, body,} = req;

    const categories = await Category.findAll({
        include: [
            {
                model: Good,
                attributes: ['id', 'title'],
                through: {
                    model: CategoryGood,
                    attributes: []
                }
            }
        ]
    });

    res.statusCode = 200;
    res.json(categories);
}

export default handler;
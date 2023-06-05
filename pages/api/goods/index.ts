import {Good, User, Order, OrderGood, Category, CategoryGood} from '@/database/models/index'


async function handler(req, res) {
    const {query: { nextPage }, method, body,} = req;

    const goods = await Good.findAll({
        include: [
            {
                attributes: ['username', 'email'],
                model: User,
                as: 'seller'},
            {
                model: Order,
                attributes: ['id'],
                through: {
                    model: OrderGood,
                   attributes: []
                }
            },
            {
                model: Category,
                attributes: ['text'],
                through: {
                    model: CategoryGood,
                    attributes: []
                }
            }
        ]
    });

    res.statusCode = 200;
    res.json(goods);
}

export default handler;
import {Good, User, Order, OrderGood} from '@/database/models/index'


async function handler(req, res) {
    const {query: { nextPage }, method, body,} = req;

    const orders = await Order.findAll({
        include: [{
            attributes: ['username', 'email'],
            model: User,
            as: 'customer'},
            {
                model: Good,
                attributes: ['id', 'title'],
                through: {
                    model: OrderGood,
                    attributes: ['quantity'],
                }
            }
        ]
    });

    res.statusCode = 200;
    res.json(orders);
}

export default handler;
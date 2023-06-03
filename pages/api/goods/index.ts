import {Good, User} from '@/database/models/index'


async function handler(req, res) {
    const {query: { nextPage }, method, body,} = req;

    const goods = await Good.findAll({
        include: {
            attributes: ['username', 'email'],
            model: User,
            as: 'seller'},
    });

    res.statusCode = 200;
    res.json(goods);
}

export default handler;
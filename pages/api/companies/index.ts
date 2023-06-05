import {User, Company} from '@/database/models/index'


async function handler(req, res) {
    const {query: { nextPage }, method, body,} = req;

    const companies = await Company.findAll({
        include: [{
            attributes: ['username', 'email'],
            model: User,
            as: 'sellers'},

        ]
    });

    res.statusCode = 200;
    res.json(companies);
}

export default handler;
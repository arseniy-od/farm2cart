import {User} from '@/database/models/index'


async function handler(req, res) {
    const {query: { nextPage }, method, body,} = req;

    const users = await User.findAll({
        attributes: ['firstName', 'lastName', 'username', 'email']
    });

    res.statusCode = 200;
    res.json(users);
}

export default handler;
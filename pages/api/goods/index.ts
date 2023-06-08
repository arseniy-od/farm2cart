import { NextApiRequest, NextApiResponse } from "next";
import { createRouter} from "next-connect";

import {getGoods, createGood} from '@/services/good'


const router = createRouter<NextApiRequest, NextApiResponse>();


router
    .get(async (req, res) => {
    const goods = await getGoods();
    
    res.json(goods);
})
    .post(async (req, res) => {
    const good = await createGood(req.body);
    res.json(good);
});


export default router.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});




// import { Good, User, Order, OrderGood, Category, CategoryGood } from '@/database/models/index'


// async function handler(req, res) {
//     const { query: { nextPage }, method, body, } = req;

//     const goods = await Good.findAll({
//         include: [
//             {
//                 attributes: ['username', 'email'],
//                 model: User,
//                 as: 'seller'
//             },
//             {
//                 model: Order,
//                 attributes: ['id'],
//                 through: {
//                     model: OrderGood,
//                     attributes: []
//                 }
//             },
//             {
//                 model: Category,
//                 attributes: ['text'],
//                 through: {
//                     model: CategoryGood,
//                     attributes: []
//                 }
//             }
//         ]
//     });

//     res.statusCode = 200;
//     res.json(goods);
// }

// export default handler;
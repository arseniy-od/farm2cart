import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

import { getGoods, createGood } from '@/services/good'
import session from "@/middleware/session";
import passport from "@/middleware/passport";

const router = createRouter<NextApiRequest, NextApiResponse>();


router
    .use(session)
    .use(passport.initialize())
    .use(passport.session())
    .get(async (req, res) => {
        const goods = await getGoods();

        res.json(goods);
    })
    .post(async (req, res) => {
        const goodData = { ...req.body, seller_id: req.user.id }
        console.log("[api/goods] goodData: ", goodData)
        const good = await createGood(goodData);
        res.json(goodData);
    });


export default router.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});

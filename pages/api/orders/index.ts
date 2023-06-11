import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

import { getOrders } from '@/services/order'
import session from "@/middleware/session";
import passport from "@/middleware/passport";


const router = createRouter<NextApiRequest, NextApiResponse>();

router
    .use(session)
    .use(passport.initialize())
    .use(passport.session())
    .get(async (req, res) => {
        const orders = await getOrders();

        res.json(orders);
    });


export default router.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});
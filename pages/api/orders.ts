import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

import { getOrders, createOrder } from '@/server/services/order'
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
    })
    .post(
        async (req, res) => {
            const OrderData = {
                ...req.body,
                customerId: req.user.id,
                paymentStatus: "Ok" 
            }
            
            const order = await createOrder(OrderData);
            console.log("[POST] order: ", order);
            req.session.cart = null;
            res.json(order)
        }
    );


export default router.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});
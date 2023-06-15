import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

import session from "@/middleware/session";
import passport from "@/middleware/passport";
import container from "@/server/container";


const router = createRouter<NextApiRequest, NextApiResponse>();

router
    .use(session)
    .use(passport.initialize())
    .use(passport.session())
    .get(async (req, res) => {
        const orders = await container.resolve("OrderService").getOrders();
        res.json(orders);
    })
    .post(
        async (req, res) => {
            const OrderData = {
                ...req.body,
                customerId: req.user.id,
                paymentStatus: "Ok" 
            }
            
            const order = await container.resolve("OrderService").createOrder(OrderData);
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
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter, expressWrapper } from "next-connect";


import session from "@/middleware/session";
import passport from "@/middleware/passport";

export const router = createRouter<NextApiRequest, NextApiResponse>()


router
    .use(session)
    .use(passport.initialize())
    .use(passport.session())
    .get(async (req: NextApiRequest, res: NextApiResponse) => {
        const cart = req.session.cart;
        res.json(cart);
    })
    .post(async (req, res) => {
        const goodData = req.body
        req.session.cart = req.session.cart || [];
        console.log("[POST] Cart: ", req.session.cart)
        await req.session.cart.push(goodData);
        await req.session.commit()
    });


export default router.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});

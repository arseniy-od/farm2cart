import container from '@/server/container'

export default container.resolve('CartController').handler('/api/cart')

// import { NextApiRequest, NextApiResponse } from "next";
// import { createRouter } from "next-connect";

// import session from "@/middleware/session";
// import passport from "@/middleware/passport";

// export const router = createRouter<NextApiRequest, NextApiResponse>()

// router
//     .use(session)
//     .use(passport.initialize())
//     .use(passport.session())
//     .get(async (req: NextApiRequest, res: NextApiResponse) => {
//         const cart = req.session.cart;
//         if (cart) {
//             res.json(cart);
//         } else {
//             res.json({blank: true})
//         }

//     })
//     .post(async (req, res) => {
//         const goodData = req.body
//         req.session.cart = req.session.cart || [];
//         await req.session.cart.push(goodData);
//         await req.session.commit()
//         console.log("[POST] Cart: ", req.session.cart)

//         res.json(req.session.cart)
//     })
//     .delete(async (req, res) => {
//         console.log('===============API==DELETE=======================\n\n')
//         console.log("index, ", req.query.index)
//         console.log("Cart: ", await req.session.cart)
//         const good = await req.session.cart.splice(parseInt(req.query.index), 1);
//         if (!req.session.cart.length) {
//             req.session.cart = null
//             }
//         res.json({ res: "Good deleted" });
//     });

// export default router.handler({
//     onError: (err, req, res) => {
//         console.error(err.stack);
//         res.status(err.statusCode || 500).end(err.message);
//     },
// });

import container from '@/server/container'

export default container.resolve('UserController').handler('/api/users/me')

// import { NextApiRequest, NextApiResponse } from "next";
// import { createRouter } from "next-connect";

// import session from "@/middleware/session";
// import passport from "@/middleware/passport";
// import container from "@/server/container";

// const router = createRouter<NextApiRequest, NextApiResponse>();

// router
//     .use(session)
//     .use(passport.initialize())
//     .use(passport.session())
//     .get(async (req, res) => {
//         // console.log("=============================\n\n[api/users/me] req.session:\n ", req.session)
//         // console.log("[api/users/me] req.user: ", req.user)
//         if (!req.user) {
//             res.json({error: true, message: "You are not logged in"})
//         } else {
//             res.json(Object.assign({error: null}, req.user.dataValues))
//         }

//     })

// export default router.handler({
//     onError: (err, req, res) => {
//         console.error(err.stack);
//         res.status(err.statusCode || 500).end(err.message);
//     },
// });

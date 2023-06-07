import { NextApiRequest, NextApiResponse } from "next";
import { createRouter, expressWrapper } from "next-connect";

import { getUser, createUser, findUserByEmail } from '@/services/user'
import { authRouter } from "@/middleware/router";
import session from "@/middleware/session";
import passport from "@/middleware/passport";

const router = createRouter<NextApiRequest, NextApiResponse>();


router
    .use(session)
    .use(passport.initialize())
    .use(passport.session())
    .get(async (req, res) => {
        const userEmail = req.session.passport.user    
        // const requser = await req.user
        console.log("\nuser email: ", userEmail)
        // console.log("Req: ", req)
        // console.log("\nAsync User: \n", async_user)
        console.log("req.user: ", req.user)
        if (!userEmail) {
            res.json({ error: "User not found" })
        } else {
            const user = await findUserByEmail(userEmail);
            // console.log("User is: ", user)
            res.json(user);
        }
    })

export default router.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});


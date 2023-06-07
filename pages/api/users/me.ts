import { NextApiRequest, NextApiResponse } from "next";
import { createRouter, expressWrapper } from "next-connect";

import { getUser, createUser } from '@/services/user'
import { authRouter } from "@/middleware/router";
import session from "@/middleware/session";
import passport from "@/middleware/passport";

const router = createRouter<NextApiRequest, NextApiResponse>();


router
    .use(session)
    .use(passport.initialize())
    .use(passport.session())
    .get(async (req, res) => {
        const userId = req.session.passport.user
        console.log("\nUserId: \n", userId)
        console.log("\nREQUEST: \n", req)
        if (!userId) {
            res.json({ error: "User not found" })
        } else {
            const user = await getUser(userId);
            console.log("User is: ", user)
            res.json(user);
        }
    })

export default router.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});


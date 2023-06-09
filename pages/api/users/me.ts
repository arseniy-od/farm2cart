import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

import { getUser, createUser, findUserByEmail, findUserById } from '@/services/user'
import { authRouter } from "@/middleware/router";
import session from "@/middleware/session";
import passport from "@/middleware/passport";

const router = createRouter<NextApiRequest, NextApiResponse>();


router
    .use(session)
    .use(passport.initialize())
    .use(passport.session())
    .get(async (req, res) => {
        if (!req.user) {
            res.json({error: true, message: "You are not logged in"})
        } else {
            res.json(Object.assign({error: null}, req.user.dataValues))    
        }
        
    })

export default router.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});


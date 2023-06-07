import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

import { authRouter } from '@/middleware/router'
import passport from "@/middleware/passport";
import session from "@/middleware/session";
import nextSession from 'next-session'

const router = createRouter<NextApiRequest, NextApiResponse>();

router
    .use(session)
    .use(passport.initialize())
    .use(passport.session())
    .post((req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                console.log("\nPassport authenticate error:\n", err)
                // console.log("\n\nRequest is: ", req)
                return next(err)
            }
            if (!user) {
                return res.status
            }
            req.logIn(user, (err) => {
                if (err) {
                    console.log("\nDev: LogIn Error: \n", err)
                    return next(err);
                }
                // console.log("Passport authenticate: User: ", user)
                return res.json({ user });

            });

            console.log("Request User is: ", req.user)
        })(req, res, next);
    });


export default router.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});
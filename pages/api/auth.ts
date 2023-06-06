import { NextApiRequest, NextApiResponse } from "next";
import { createRouter, expressWrapper } from "next-connect";

import { getUsers, createUser } from '@/services/user'
import passport from "../../middleware/passport";
import { passportAuth } from "../../middleware/passport";
import { session } from '@/middleware/session'


const router = createRouter<NextApiRequest, NextApiResponse>();



router
    .use(passport.initialize())
    .use(passport.session())
    .post((req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({ message: info.message });
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.json({ user });
            });
        })(req, res, next);
    });


export default router.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});
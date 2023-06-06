import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

import passport from "@/middleware/passport";
import session from '@/middleware/session'



const router = createRouter<NextApiRequest, NextApiResponse>();



router
    .use(
        session({
            name: 'sess',
            secret: 'Very_secret_key_and_very_long_also',
            cookie: {
                maxAge: 60 * 60 * 8, // 8 hours,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                sameSite: 'lax',
            },
        })
    )
    .use(passport.initialize())
    .use(passport.session())


export {router};
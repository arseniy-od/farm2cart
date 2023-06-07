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
    console.log("\nRequest for logOut is: \n", req.logOut)
    req.logOut()
    res.json({result: "Logged out"});

  })

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});

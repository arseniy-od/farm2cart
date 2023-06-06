import { NextApiRequest, NextApiResponse } from "next";
import { createRouter, expressWrapper } from "next-connect";

import {getUser, createUser} from '@/services/user'
import {router} from "@/middleware/router";

// const router = createRouter<NextApiRequest, NextApiResponse>();


router
    .get(async (req, res) => {
        console.log("Request.user: ", req.user)
        if (!req.user) {
            res.json({error: "User not found"})
        } else {
            const user = await getUser(req.user.id);
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


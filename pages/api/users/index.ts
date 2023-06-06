import { NextApiRequest, NextApiResponse } from "next";
import { createRouter, expressWrapper } from "next-connect";

import {getUsers, createUser} from '@/services/user'


const router = createRouter<NextApiRequest, NextApiResponse>();


router
    .get(async (req, res) => {
    const users = await getUsers();
    
    res.json(users);
})
    .post(async (req, res) => {
    const user = await createUser(req.body);
    res.json(user);
});


export default router.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});


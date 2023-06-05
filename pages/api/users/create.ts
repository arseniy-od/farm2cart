import {User} from '@/database/models/index'
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter, expressWrapper } from "next-connect";
import cors from "cors";


import {getUsers, createUser} from '@/services/user'
import {ServerResponse} from "http";

export const router = createRouter<NextApiRequest, NextApiResponse>()


router.post(async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await createUser(req.body);
    res.json(user);
});


export default router.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});

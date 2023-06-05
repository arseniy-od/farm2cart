import { NextApiRequest, NextApiResponse } from "next";
import { createRouter, expressWrapper } from "next-connect";


import {getUsers} from '@/services/user'


export const router = createRouter<NextApiRequest, NextApiResponse>()


router.get(async (req: NextApiRequest, res: NextApiResponse) => {
    const users = await getUsers();
    res.json(users);
});


export default router.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});

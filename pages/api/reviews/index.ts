import {Review} from '@/database/models/index'
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter, expressWrapper } from "next-connect";
import cors from "cors";


import {getReviews} from '@/services'
import {ServerResponse} from "http";

export const router = createRouter<NextApiRequest, NextApiResponse>()


router.get(async (req: NextApiRequest, res: NextApiResponse) => {
    const reviews = await getReviews();
    res.json(reviews);
});


export default router.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});

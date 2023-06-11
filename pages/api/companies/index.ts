import {createRouter} from "next-connect";
import {NextApiRequest, NextApiResponse} from "next";

import {User, Company} from '@/database/models/index'
import { getCompanies } from '@/services/company'

export const router = createRouter<NextApiRequest, NextApiResponse>()


router.get(async (req: NextApiRequest, res: NextApiResponse) => {
    const companies = await getCompanies();
    res.json(companies);
});


export default router.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});


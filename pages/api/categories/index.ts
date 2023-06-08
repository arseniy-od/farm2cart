import {Category, Good, CategoryGood} from '@/database/models/index'
import {getCategories} from "@/services/category"
import {createRouter} from "next-connect";
import {NextApiRequest, NextApiResponse} from "next";


export const router = createRouter<NextApiRequest, NextApiResponse>()


router.get(async (req: NextApiRequest, res: NextApiResponse) => {
    const categories = await getCategories();
    res.json(categories);
});


export default router.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});


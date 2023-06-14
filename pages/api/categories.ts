import {Category, Good, CategoryGood} from '@/server/database/models/index'
import {getCategories, createCategory, deleteCategory, updateCategory} from "@/server/services/category"
import {createRouter} from "next-connect";
import {NextApiRequest, NextApiResponse} from "next";


export const router = createRouter<NextApiRequest, NextApiResponse>()


router
    .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const categories = await getCategories();
    res.json(categories);
    })
    .post(async (req: NextApiRequest, res: NextApiResponse) => {
        console.log('[api/categories] req.body', req.body)
        const category = await createCategory(req.body)
    })
    .delete(async (req: NextApiRequest, res: NextApiResponse) => {
        const category = await deleteCategory(req.query.id)
        res.json({res: 'Category deleted'})
    })
    .patch(async (req: NextApiRequest, res: NextApiResponse) => {
        const id = req.query.id
        const category = await updateCategory(id, req.body)
        res.json(category)
    });


export default router.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});


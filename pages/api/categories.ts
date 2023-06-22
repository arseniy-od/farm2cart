import { createRouter } from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'

import container from '@/server/container'

export const router = createRouter<NextApiRequest, NextApiResponse>()

router
    .get(async (req: NextApiRequest, res: NextApiResponse) => {
        const categories = await container
            .resolve('CategoryService')
            .getCategories()
        res.json(categories)
    })
    .post(async (req: NextApiRequest, res: NextApiResponse) => {
        console.log('[api/categories] req.body', req.body)
        const category = await container
            .resolve('CategoryService')
            .createCategory(req.body)
    })
    .delete(async (req: NextApiRequest, res: NextApiResponse) => {
        const category = await container
            .resolve('CategoryService')
            .deleteCategory(req.query.id)
        res.json({ res: 'Category deleted' })
    })
    .patch(async (req: NextApiRequest, res: NextApiResponse) => {
        const id = req.query.id
        const category = await container
            .resolve('CategoryService')
            .updateCategory(id, req.body)
        res.json(category)
    })

export default router.handler({
    onError: (err, req, res) => {
        console.error(err.stack)
        res.status(err.statusCode || 500).end(err.message)
    },
})

import { createRouter } from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import container from '@/server/container'

export const router = createRouter<NextApiRequest, NextApiResponse>()

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
    const companies = await container
        .resolve('CompanyController')
        .getCompanies()
    res.json(companies)
})

export default router.handler({
    onError: (err, req, res) => {
        console.error(err.stack)
        res.status(err.statusCode || 500).end(err.message)
    },
})

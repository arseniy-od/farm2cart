import container from '@/server/container'

export default container.resolve('GoodController').handler('/api/goods')

export const config = {
    api: {
        bodyParser: false,
        // {sizeLimit: '4mb'}
    },
}

// import { NextApiRequest, NextApiResponse } from 'next'
// import { createRouter } from 'next-connect'

// import session from '@/middleware/session'
// import passport from '@/middleware/passport'
// import uploadMiddleware from '@/middleware/upload'
// import container from '@/server/container'
// import { log } from 'console'

// const router = createRouter<NextApiRequest, NextApiResponse>()

// router
//     .use(session)
//     .use(passport.initialize())
//     .use(passport.session())
//     .use(uploadMiddleware)
//     .get(async (req, res) => {
//         log('[api] get goods')
//         const goods = await container.resolve('GoodController').getGoods()
//         res.json(goods)
//     })
//     .post(async (req, res) => {
//         const good = await container.resolve('GoodController').createGood(req)
//         res.json(good)
//     })
//     .put(async (req, res) => {
//         console.log('\n\n=================[PUT]=============')
//         const good = await container.resolve('GoodController').updateGood(req)
//         res.json(good)
//     })
//     .delete(async (req, res) => {
//         const result = await container.resolve('GoodController').deleteGood(req)
//         res.json(result)
//     })

// export const config = {
//     api: {
//         bodyParser: false,
//         // {sizeLimit: '4mb'}
//     },
// }

// export default router.handler({
//     onError: (err, req, res) => {
//         console.error(err.stack)
//         res.status(err.statusCode || 500).end(err.message)
//     },
// })

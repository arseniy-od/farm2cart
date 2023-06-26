import container from '@/server/container'

export default container.resolve('UserController').handler('/api/users')

// import { NextApiRequest, NextApiResponse } from 'next'
// import { createRouter, expressWrapper } from 'next-connect'

// import container from '@/server/container'

// const router = createRouter<NextApiRequest, NextApiResponse>()

// router
//     .get(async (req, res) => {
//         const users = await container.resolve('UserController').getUsers()
//         // const users = await getUsers();

//         res.json(users)
//     })
//     .post(async (req, res) => {
//         const user = await container.resolve('UserController').createUser(req)
//         res.json(user)
//     })
//     .delete(async (req, res) => {
//         console.log('Req query--------------------\n', req.query)
//         const user = await container.resolve('UserController').deleteUser(req)
//         res.json({ res: 'User deleted' })
//     })

// export default router.handler({
//     onError: (err, req, res) => {
//         console.error(err.stack)
//         res.status(err.statusCode || 500).end(err.message)
//     },
// })

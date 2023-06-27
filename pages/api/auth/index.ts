import container from '@/server/container'

export default container.resolve('AuthController').handler('/api/auth')

// import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
// import { NextHandler, createRouter } from 'next-connect'

// // import { authRouter } from '@/middleware/router'
// import passport, { passportAuth } from '@/middleware/passport'
// import session from '@/middleware/session'
// import nextSession from 'next-session'
// import { isConstructorDeclaration } from 'typescript'

// const router = createRouter<NextApiRequest, NextApiResponse>()

// router
//     .use(session)
//     .use(passport.initialize())
//     .use(passport.session())
//     .use(passportAuth)
//     .post((req) => req.user)

// export default router.handler({
//     onError: (err, req, res) => {
//         console.error(err.stack)
//         res.status(err.statusCode || 500).end(err.message)
//     },
// })

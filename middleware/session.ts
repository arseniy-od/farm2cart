// import { createClient } from 'redis';
// import connectRedis from 'connect-redis';
//
// import nextSession from 'next-session';
// import { expressSession, promisifyStore } from 'next-session/lib/compat';
//
// const RedisStore = connectRedis(expressSession);
// const redisOptions = {
//     legacyMode: true,
// };
// // if (config.redis.password) {
// //   redisOptions['password'] = config.redis.password;
// // }
// const redisClient = createClient(redisOptions);
// redisClient.connect().catch((e) => {
//     console.error('Session Redis Error', e);
// });
//
// const getSession = nextSession({
//     store: promisifyStore(
//         new RedisStore({
//             client: redisClient as any,
//         })
//     ),
//     cookie: {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         maxAge: 2 * 7 * 24 * 60 * 60, // 2 weeks,
//         path: '/',
//         sameSite: 'strict',
//     },
//     touchAfter: 1 * 7 * 24 * 60 * 60, // 1 week
// });
//
// export default async function session(req, res, next) {
//     await getSession(req, res);
//     await next();
// }


import { parse, serialize } from 'cookie'
import { createLoginSession, getLoginSession } from './auth'

function parseCookies(req) {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) return req.cookies

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie
  return parse(cookie || '')
}

export default function session({ name, secret, cookie: cookieOpts }) {
  return async (req, res, next) => {
    const cookies = parseCookies(req)
    const token = cookies[name]
    let unsealed = {}

    if (token) {
      try {
        // the cookie needs to be unsealed using the password `secret`
        unsealed = await getLoginSession(token, secret)
      } catch (e) {
        // The cookie is invalid
      }
    }

    req.session = unsealed

    // We are proxying res.end to commit the session cookie
    const oldEnd = res.end
    res.end = async function resEndProxy(...args) {
      if (res.finished || res.writableEnded || res.headersSent) return
      if (cookieOpts.maxAge) {
        req.session.maxAge = cookieOpts.maxAge
      }

      const token = await createLoginSession(req.session, secret)

      res.setHeader('Set-Cookie', serialize(name, token, cookieOpts))
      oldEnd.apply(this, args)
    }

    next()
  }
}
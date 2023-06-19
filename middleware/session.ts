import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from 'redis';
import Redis from "ioredis";
// import connectRedis from 'connect-redis';
import RedisStore from "connect-redis";

import nextSession from 'next-session';
import { promisifyStore } from 'next-session/lib/compat';
import passport from "@/middleware/passport";
import { promisify } from "util";



const redisOptions = {
  legacyMode: true,
};
// if (config.redis.password) {
//   redisOptions['password'] = config.redis.password;
// }
const redisClient = createClient(redisOptions);
redisClient.connect().catch((e) => {
  console.error('Session Redis Error', e);
});



const getSession = nextSession({
  store: promisifyStore(
    new RedisStore({
      // client: redisClient as any,
      client: new Redis(),
      ttl: 7 * 24 * 60 * 60,
    })
  ),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 2 * 7 * 24 * 60 * 60, // 2 weeks,
    path: '/',
    sameSite: 'strict',
  },
  touchAfter: 1 * 7 * 24 * 60 * 60, // 1 week
});


export default async function session(req: NextApiRequest, res: NextApiResponse, next) {
  await getSession(req, res);
  return await next();
}

const passportInit = passport.initialize();
const passportSession = passport.session();

export const middlewares = [
  async (req, res, next) => {
    const f: {resolve: (value?: unknown) => void} = {resolve: () => null}
    const pr: Promise<unknown> = new Promise((resolve, reject) => {
        f.resolve = resolve;
    });
    passportInit(req, res, () => {
        f.resolve();
    });
    await pr;
    return await next();
  },
  async (req, res, next) => {
    const f = {}
    const pr: Promise<unknown> = new Promise((resolve, reject) => {
        f.resolve = resolve
    });
    
    await passportSession(req, res, () => {f.resolve()});
    await pr;
    return await next();
  }
]



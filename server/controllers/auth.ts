import { NextApiRequest, NextApiResponse } from 'next'
import BaseController from './baseController'
import GET from '../decorators/get'
import POST from '../decorators/post'
import SSR from '../decorators/ssr'
import USE from '../decorators/use'
import session, { passportInit, passportSession } from '@/middleware/session'
import { NextApiRequestWithUser } from '@/app/interfaces'
import passport, { passportAuth } from '@/middleware/passport'
// import passport from '@/middleware/passport'

@USE([session, passportInit, passportSession])
export default class AuthController extends BaseController {
    @POST('/api/auth')
    @USE(passportAuth)
    async loginUser(req: NextApiRequestWithUser) {
        return req.identity
    }

    @GET('/api/auth/logout')
    logout(req: NextApiRequestWithUser) {
        // req.logOut()
        req.session.destroy()
        return { result: 'Logged out' }
    }
}

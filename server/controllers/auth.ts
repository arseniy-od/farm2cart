import { NextApiRequest, NextApiResponse } from 'next'

import BaseController from './baseController'

import GET from '../decorators/get'
import POST from '../decorators/post'
import SSR from '../decorators/ssr'
import USE from '../decorators/use'

import session, { passportInit, passportSession } from '@/middleware/session'
import { NextApiRequestWithUser } from '@/app/types/interfaces'
import { passportAuth } from '@/middleware/passport'
import validate from '../validation/validator'
import { loginSchema } from '../validation/schemas'

@USE([session, passportInit, passportSession])
export default class AuthController extends BaseController {
    @POST('/api/auth')
    @USE(passportAuth)
    @USE(validate(loginSchema))
    loginUser(req: NextApiRequestWithUser) {
        console.log('[AuthController] identity:', req.identity)
        return req.identity
    }

    @GET('/api/auth/logout')
    logout(req: NextApiRequestWithUser) {
        // req.logOut()
        req.session.destroy()
        return { result: 'Logged out' }
    }
}

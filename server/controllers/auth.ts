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
import { CODES } from '@/app/constants'

@USE([session, passportInit, passportSession])
export default class AuthController extends BaseController {
    @POST('/api/auth')
    @USE(passportAuth)
    @USE(validate(loginSchema))
    loginUser(req: NextApiRequestWithUser) {
        this.createMessage({
            successMessage: 'You are logged in!',
            failMessage: 'Error while authentication',
            successCode: CODES.TOAST,
            failCode: CODES.TOAST,
        })
        console.log(
            '=================================================================='
        )
        console.log('[loginUser] user:', req.identity)
        // return { lol: 'kek' }
        return req.identity
    }

    @GET('/api/auth/logout')
    logout(req: NextApiRequestWithUser) {
        this.createMessage({
            successMessage: 'You are logged out!',
            failMessage: 'Error while logging out',
            successCode: CODES.TOAST,
            failCode: CODES.TOAST,
        })
        req.session.destroy()
        return { result: 'Logged out' }
    }
}

import {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
    PreviewData,
} from 'next'
import { ParsedUrlQuery } from 'querystring'
import { NextApiRequestWithUser, user } from '@/app/types/interfaces'

import USE from '../decorators/use'
import GET from '../decorators/get'
import POST from '../decorators/post'
import DELETE from '../decorators/delete'
import PATCH from '../decorators/patch'
import SSR from '../decorators/ssr'

import session, { passportInit, passportSession } from '@/middleware/session'
import BaseController from './baseController'
import { userSchema } from '../validation/schemas'
import validate from '../validation/validator'
import { clientDi } from '@/redux/container'
import { CODES } from '@/app/constants'

@USE([session, passportInit, passportSession])
export default class UserController extends BaseController {
    private UserService = this.di.UserService
    private GoodService = this.di.GoodService
    private OrderService = this.di.OrderService

    constructor(opts) {
        super(opts)
        this.schema = clientDi('UserEntity').schema
    }

    @SSR('/users')
    @GET('/api/users')
    async getUsers() {
        this.createMessage({
            successMessage: 'Users found',
            failMessage: 'Users not found',
            successCode: CODES.DEBUG,
            failCode: CODES.TOAST,
        })
        return await this.UserService.getUsers()
    }

    @POST('/api/users')
    @USE(validate(userSchema))
    async createUser(req: NextApiRequestWithUser) {
        this.createMessage({
            successMessage: 'Sign up successful',
            failMessage: 'Error while signing up',
            successCode: CODES.TOAST,
            failCode: CODES.TOAST,
        })
        return await this.UserService.createUser(req.body)
    }

    @DELETE('/api/users')
    async deleteUser(req: NextApiRequest) {
        this.createMessage({
            successMessage: 'User deleted',
            failMessage: 'Error while deleting user',
            successCode: CODES.TOAST,
            failCode: CODES.TOAST,
        })
        const id = req.query.id
        return await this.UserService.deleteUser(id)
    }

    @SSR('/users/:id')
    async getUserWithGoods(ctx) {
        const { id } = ctx.params
        this.createMessage({
            successMessage: 'User found',
            failMessage: 'User not found',
            successCode: CODES.DEBUG,
            failCode: CODES.TOAST,
        })
        return await this.UserService.getUserById(id)
    }

    @GET('/api/users/me')
    getUser(req) {
        this.createMessage({
            successMessage: 'Current user fetched',
            failMessage: 'No current user',
            successCode: CODES.DEBUG,
            failCode: CODES.DEBUG,
        })
        return req.identity
    }
}

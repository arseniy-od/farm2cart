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
        const result = await this.UserService.getUsers()
        const users = JSON.parse(JSON.stringify(result))
        if (!users || !users.length) {
            return { props: { notFound: true } }
        }
        return users
    }

    @POST('/api/users')
    @USE(validate(userSchema))
    async createUser(req: NextApiRequestWithUser) {
        const result = await this.UserService.createUser(req.body)
        const user = JSON.parse(JSON.stringify(result))
        if (!user) {
            return { notFound: true }
        }
        if (user.error) {
            console.error('[UserController/createUser]: ', user.message)
            return user
        }
        return user
    }

    @DELETE('/api/users')
    async deleteUser(req: NextApiRequest) {
        const id = req.query.id
        if (!id || id instanceof Array) {
            return { error: true, message: 'Please provide 1 valid user id' }
        }
        const deleted = await this.UserService.deleteUser(id)
        return deleted
    }

    @SSR('/users/:id')
    async getUserWithGoods(ctx) {
        const { id } = ctx.params
        if (!id || id instanceof Array) {
            return {
                props: { user: { error: true, message: 'User not found' } },
            }
        }
        const user = await this.UserService.getUserById(id)
        console.log('\n\n\nUSER: ', user.toJSON())
        return user
    }

    @GET('/api/users/me')
    getUser(req) {
        console.log('getUser called')

        return req.identity
    }

    @SSR('/users/me')
    async getUserByReq({ identity }) {
        return identity
    }

    // @SSR('users/me/goods')
    // async getGoodsForUser(req: NextApiRequestWithUser) {
    //     if (!req.user) {
    //         return {
    //             props: {
    //                 user: { error: true, message: 'You are not logged in' },
    //             },
    //         }
    //     }
    //     const goods = await this.GoodService.getGoodsBySellerId(req.user.id)
    //     const parsedUser = JSON.parse(JSON.stringify(req.user))
    //     const parsedGoods = JSON.parse(JSON.stringify(goods))
    //     return {
    //         props: {
    //             user: parsedUser,
    //             goods: parsedGoods,
    //         },
    //     }
    // }

    // @SSR('/users/me/orders')
    // async getOrdersForUser(req: NextApiRequestWithUser) {
    //     if (!req.user) {
    //         return {
    //             props: {
    //                 user: { error: true, message: 'You are not logged in' },
    //             },
    //         }
    //     }
    //     const orders = await this.OrderService.getOrdersByCustomerId(
    //         req.user.id
    //     )
    //     const parsedUser = JSON.parse(JSON.stringify(req.user))
    //     const parsedOrders = JSON.parse(JSON.stringify(orders))
    //     return {
    //         props: {
    //             user: parsedUser,
    //             orders: parsedOrders,
    //         },
    //     }
    // }
}

import {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
    PreviewData,
} from 'next'
import BaseContext from '../baseContext'
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
import passport from '@/middleware/passport'
import { userSchema } from '../validation/schemas'
import validate from '../validation/validator'

@USE([session, passportInit, passportSession])
export default class UserController extends BaseController {
    private UserService = this.di.UserService
    private GoodService = this.di.GoodService
    private OrderService = this.di.OrderService

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
    async createUser(req: NextApiRequest) {
        const result = await this.UserService.createUser(req.body)
        const user = JSON.parse(JSON.stringify(result))
        if (!user || !user.length) {
            return { notFound: true }
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
    async getUserWithGoods(
        ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
    ) {
        const { id } = ctx.params
        if (!id || id instanceof Array) {
            return {
                props: { user: { error: true, message: 'User not found' } },
            }
        }

        let user = await this.UserService.getUserById(id)
        let goods = await this.GoodService.getGoodsBySellerId(id)
        user = JSON.parse(JSON.stringify(user))
        goods = JSON.parse(JSON.stringify(goods))
        return {
            user,
            goods,
        }
    }

    @GET('/api/users/me')
    getUser(req) {
        console.log('getUser called')

        return { user: req.identity }
    }

    //! Client router with middleware is incompatible with controller with middleware
    @SSR('/users/me')
    async getUserByReq(req: NextApiRequestWithUser) {
        if (!req.user) {
            return {
                props: {
                    user: { error: true, message: 'You are not logged in' },
                },
            }
        }
        const user = JSON.parse(JSON.stringify(req.user))
        return {
            props: {
                user,
            },
        }
    }

    @SSR('users/me/goods')
    async getGoodsForUser(req: NextApiRequestWithUser) {
        if (!req.user) {
            return {
                props: {
                    user: { error: true, message: 'You are not logged in' },
                },
            }
        }
        const goods = await this.GoodService.getGoodsBySellerId(req.user.id)
        const parsedUser = JSON.parse(JSON.stringify(req.user))
        const parsedGoods = JSON.parse(JSON.stringify(goods))
        return {
            props: {
                user: parsedUser,
                goods: parsedGoods,
            },
        }
    }

    @SSR('/users/me/orders')
    async getOrdersForUser(req: NextApiRequestWithUser) {
        if (!req.user) {
            return {
                props: {
                    user: { error: true, message: 'You are not logged in' },
                },
            }
        }
        const orders = await this.OrderService.getOrdersByCustomerId(
            req.user.id
        )
        const parsedUser = JSON.parse(JSON.stringify(req.user))
        const parsedOrders = JSON.parse(JSON.stringify(orders))
        return {
            props: {
                user: parsedUser,
                orders: parsedOrders,
            },
        }
    }
}

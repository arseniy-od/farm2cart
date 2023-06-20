import {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
    PreviewData,
} from 'next'
import BaseContext from '../baseContext'
import { ParsedUrlQuery } from 'querystring'
import { NextApiRequestWithUser, user } from '@/app/interfaces'

export default class UserController extends BaseContext {
    private UserService = this.di.UserService
    private GoodService = this.di.GoodService
    private OrderService = this.di.OrderService

    async getUsers() {
        const result = await this.UserService.getUsers()
        const users = JSON.parse(JSON.stringify(result))
        if (!users || !users.length) {
            return { props: { notFound: true } }
        }
        return users
    }

    async createUser(req: NextApiRequest) {
        const result = await this.UserService.createUser(req.body)
        const user = JSON.parse(JSON.stringify(result))
        if (!user || !user.length) {
            return { notFound: true }
        }
        return user
    }

    async deleteUser(req: NextApiRequest) {
        const id = req.query.id
        if (!id || id instanceof Array) {
            return { error: true, message: 'Please provide 1 valid user id' }
        }
        const deleted = await this.UserService.deleteUser(id)
        return deleted
    }

    async getUserWithGoods(
        ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
    ) {
        const { id } = ctx.query
        if (!id || id instanceof Array) {
            return { props: { user: { notFound: true } } }
        }

        const userData = await this.UserService.getUserById(id)
        const goodsData = await this.GoodService.getGoodsBySellerId(id)
        const parsedUser = JSON.parse(JSON.stringify(userData))
        const parsedGoods = JSON.parse(JSON.stringify(goodsData))
        return {
            props: {
                user: parsedUser,
                goods: parsedGoods,
            },
        }
    }

    async getGoodsAndOrdersForUser(req: NextApiRequestWithUser) {
        if (!req.user) {
            return {
                props: {
                    user: { error: true, message: 'You are not logged in' },
                },
            }
        }
        const goods = await this.GoodService.getGoodsBySellerId(req.user.id)
        const orders = await this.OrderService.getOrdersByCustomerId(
            req.user.id
        )
        const parsedUser = JSON.parse(JSON.stringify(req.user))
        const parsedGoods = JSON.parse(JSON.stringify(goods))
        const parsedOrders = JSON.parse(JSON.stringify(orders))
        return {
            props: {
                user: parsedUser,
                goods: parsedGoods,
                orders: parsedOrders,
            },
        }
    }
}

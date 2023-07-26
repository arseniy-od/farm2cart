import { Op } from 'sequelize'
import BaseContext from '../baseContext'
import { orderWithGoodsCreate } from '@/app/types/interfaces'
import { ORDERS_PER_PAGE } from '@/app/constants'
export default class OrderService extends BaseContext {
    private Good = this.di.Good
    private User = this.di.User
    private Review = this.di.Review
    private Category = this.di.Category
    private Order = this.di.Order
    private OrderGood = this.di.OrderGood

    async getOrders() {
        return await this.Order.findAll({
            include: [
                {
                    attributes: ['username', 'email'],
                    model: this.User,
                    as: 'customer',
                },
                {
                    model: this.Good,
                    as: 'goods',
                    through: { attributes: ['id', 'quantity'] },
                },
            ],
        })
    }

    async createOrder(orderData: orderWithGoodsCreate) {
        const newOrder = await this.Order.create(orderData)
        await orderData.goods.forEach(async (good) => {
            const goodOrder = await this.Good.findOne({
                where: { id: good.id },
            })
            if (goodOrder === null) {
                return null
            }

            await goodOrder?.decrement('available', { by: good.quantity })
            await newOrder.addGood(goodOrder, {
                through: { quantity: good.quantity },
            })
        })
        return newOrder
    }

    async getOrderById(id: string) {
        return await this.Order.findOne({
            where: { id },
            include: [
                {
                    model: this.Good,
                    as: 'goods',
                    through: {
                        attributes: [],
                    },
                },
                {
                    model: this.OrderGood,
                    attributes: ['id', 'goodId', 'orderId', 'quantity'],
                },
            ],
        })
    }

    async getOrdersByCustomerId(
        page: number,
        searchQuery: string,
        id: string | number
    ) {
        console.log('[order service] query: ', searchQuery)
        const orders = await this.Order.findAndCountAll({
            where: { customerId: id, id: { [Op.like]: `%${searchQuery}%` } },
            // include: [
            //     {
            //         model: this.Good,
            //         as: 'goods',
            //         where: { title: { [Op.like]: `%${searchQuery}%` } },
            //         through: {
            //             attributes: [],
            //         },
            //     },
            //     // {
            //     //     model: this.OrderGood,
            //     //     attributes: ['id', 'goodId', 'orderId', 'quantity'],
            //     // },
            // ],
            order: [['id', 'ASC']],
            offset: (page - 1) * ORDERS_PER_PAGE,
            limit: ORDERS_PER_PAGE,
            subQuery: false,
        })

        const ordersWithGoods = await Promise.all(
            orders.rows.map(async (order) => {
                const goods = await order.getGoods()
                const OrderGoods = await order.getOrderGoods({
                    attributes: ['id', 'goodId', 'orderId', 'quantity'],
                })
                // console.log('\n\n\nARE SEARCHED: ', areSearched)
                return {
                    ...order.toJSON(),
                    goods,
                    OrderGoods,
                }
            })
        )
        return { count: orders.count, result: ordersWithGoods, pageName: '' }
    }
}

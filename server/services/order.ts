import BaseContext from '../baseContext'
import { orderWithGoodsCreate } from '@/app/types/interfaces'
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

    async getOrdersByCustomerId(id: string | number) {
        return await this.Order.findAll({
            where: { customerId: id },
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
}

import { User, Review, Good, Order, OrderGood, Category, CategoryGood, Company } from '@/database/models'
import { GOOGLE_FONT_PROVIDER } from 'next/dist/shared/lib/constants';


export function getOrders() {
    return (
        Order.findAll({
            include: [{
                attributes: ['username', 'email'],
                model: User,
                as: 'customer'},
                {
                    model: Good,
                    attributes: ['id', 'title'],
                }
            ]
        })
    );
}


export async function createOrder(orderData) {
    const newOrder =  await Order.create(orderData);
    await orderData.goods.forEach(async good => {
        const goodOrder = await Good.findOne({ where: { id: good.id } })
        await goodOrder?.decrement('available', {by: good.quantity});
        await newOrder.addGood(goodOrder, {through: {quantity: good.quantity}})
    })
    return newOrder
}


export async function getOrderById(id) {
    return await Order.findOne({
        where: {id},
        include: {
            model: Good,
            as: "goods",
            through: { attributes: ['quantity'] },
        }
    })
}


export async function getAllOrderIds() {
    const orders = await Order.findAll()
    return orders.map(order => {
        return {
            params: {
                id: order.id.toString()
            }
        }
    })
}
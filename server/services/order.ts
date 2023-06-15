import BaseContext from "../baseContext";

export default class OrderService extends BaseContext {
    private Good = this.di.Good;
    private User = this.di.User;
    private Review = this.di.Review;
    private Category = this.di.Category;
    private Order = this.di.Order;

    async getOrders() {
        return (
            await this.Order.findAll({
                include: [{
                    attributes: ['username', 'email'],
                    model: this.User,
                    as: 'customer'},
                    {
                        model: this.Good,
                        attributes: ['id', 'title'],
                    }
                ]
            })
        );
    }
    
    
    async createOrder(orderData) {
        const newOrder =  await this.Order.create(orderData);
        await orderData.goods.forEach(async good => {
            const goodOrder = await this.Good.findOne({ where: { id: good.id } })
            await goodOrder?.decrement('available', {by: good.quantity});
            await newOrder.addGood(goodOrder, {through: {quantity: good.quantity}})
        })
        return newOrder
    }
    
    
    async getOrderById(id) {
        return await this.Order.findOne({
            where: {id},
            include: {
                model: this.Good,
                as: "goods",
                through: { attributes: ['quantity'] },
            }
        })
    }
    
    
    async getAllOrderIds() {
        const orders = await this.Order.findAll()
        return orders.map(order => {
            return {
                params: {
                    id: order.id.toString()
                }
            }
        })
    }
}

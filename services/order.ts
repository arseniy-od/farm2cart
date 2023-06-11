import { User, Review, Good, Order, OrderGood, Category, CategoryGood, Company } from '@/database/models'


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
import {User, Review, Good, Order, OrderGood, Category, CategoryGood, Company} from '@/database/models'




export function getReviews() {
    return (Review.findAll(
        {
            include: [
                {
                    attributes: ['username', 'email'],
                    model: User,
                    as: 'author'
                },
                {
                    attributes: ['id', 'title'],
                    model: Good,
                    as: 'good'
                }

            ]
        }
    ));
}

export function getGoods() {
    return (
        Good.findAll({
            include: [
                {
                    attributes: ['username', 'email'],
                    model: User,
                    as: 'seller'},
                {
                    model: Order,
                    attributes: ['id'],
                    through: {
                        model: OrderGood,
                        attributes: []
                    }
                },
                {
                    model: Category,
                    attributes: ['text'],
                    through: {
                        model: CategoryGood,
                        attributes: []
                    }
                }
            ]
        })
    );
}

export function getCompanies() {
    return (
        Company.findAll({
            include: [{
                attributes: ['username', 'email'],
                model: User,
                as: 'sellers'},

            ]
        })
    );
}

export function getCategories() {
    return (
        Category.findAll({
            include: [
                {
                    model: Good,
                    attributes: ['id', 'title'],
                    through: {
                        model: CategoryGood,
                        attributes: []
                    }
                }
            ]
        })
    );
}

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
                    through: {
                        model: OrderGood,
                        attributes: ['quantity'],
                    }
                }
            ]
        })
    );
}
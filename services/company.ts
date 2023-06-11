import {User, Review, Good, Order, OrderGood, Category, CategoryGood, Company} from '@/database/models'


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
import { User, Review, Good, Order, OrderGood, Category, CategoryGood, Company } from '@/database/models'


export async function findGoodById(id:number) {
    const good = await Good.findOne(
        { 
            where: { id },
            include: [
                {
                    attributes: ['username', 'email'],
                    model: User,
                    as: 'seller'},
                {
                    model: Order,
                    attributes: ['id'],
                },
                {
                    model: Category,
                    attributes: ['text'],
                }
            ]
        }
        )
    if (good) { return good; }
    return { error: true, message: "Good not found" }
}

export async function getAllGoodIds() {
    const goods = await Good.findAll()
    return goods.map(good => {
        return {
            params: {
                id: good.id.toString()
            }
        }
    })
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
                },
                {
                    model: Category,
                    attributes: ['text'],
                    
                }
            ]
        })
    );
}


export async function createGood(goodData) {
    return (Good.create(goodData));
}
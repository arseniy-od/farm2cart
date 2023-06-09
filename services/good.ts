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
                },
                {
                    model: Review,
                    as: "reviews",
                    attributes: ['text', 'authorId', 'score', 'datepub'],
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'username'],
                            as: "author"
                        }
                    ]
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
                },
                {
                    model: Review,
                    attributes: ['text', 'datepub'],
                    as: "reviews",
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'username'],
                            as: "author"
                        }
                    ]
                }
            ]
        })
    );
}


export async function createGood(goodData) {
    const newGood = await Good.create(goodData);
    return newGood
    // const categorySale = await Category.findOne({where: { id: 1 }})
    // return await newGood.addCategory(categorySale)
}

export async function getGoodsForUser(userId) {
    return await Good.findAll({where: {seller_id: userId}})
}
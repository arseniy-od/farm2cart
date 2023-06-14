import { Sequelize } from 'sequelize';
import { User, Review, Good, Order, OrderGood, Category, CategoryGood, Company } from '@/server/database/models'
import sequelize from '@/server/database/models/connection';


export async function findGoodById(id: number) {
    const good = await Good.findOne(
        {
            where: { id },
            include: [
                {
                    attributes: ['id', 'username', 'email'],
                    model: User,
                    as: 'seller'
                },
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
                    ],
                    order: [['score', 'DESC']],
                }
            ]
        }
    )

    const avgScore = await Review.findOne({
        attributes: [[Sequelize.fn('AVG', Sequelize.col('score')), 'averageScore']],
        where: {
            goodId: id,
        },
    });
    if (good) { return {...JSON.parse(JSON.stringify(good)), ...JSON.parse(JSON.stringify(avgScore))}}
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

export async function getGoods() {
    // const avgScores = await Review.findAll({
    //     attributes: ['goodId', [Sequelize.fn('AVG', Sequelize.col('score')), 'averageScore']],
    //     group: ['goodId'],
    // });

    const goods = await Good.findAll({
        attributes: ["id", "title", "description", "price", "imageUrl", "available",
        [Sequelize.fn("avg", Sequelize.col("reviews.score")), "averageScore"],
        [Sequelize.fn("count", Sequelize.col("reviews.id")), "reviewsCount"]
    ],
        group: ['good.id', 'title', 'Categories.text', 'Categories.id'],
        include: [
            {
                attributes: ['id', 'username', 'email'],
                model: User,
                as: 'seller'
            },
            {
                model: Category,
                attributes: ['text'],
            },
            {
                model: Review,
                attributes: [],
                as: "reviews",
            }
        ],
    });

    // const goodsWithAvgScores = goods.map((good) => {
    //     const avgScore = avgScores.find((avg) => avg.goodId === good.id)?.dataValues.averageScore || null;
    //     return { ...good.dataValues, averageScore: avgScore };
    // });

    return goods;
}


export async function createGood(goodData) {
    const newGood = await Good.create(goodData);
    await goodData.categories.forEach(async catId => {
        const categoryGood = await Category.findOne({ where: { id: catId } })
        await newGood.addCategory(categoryGood)
    })
    return newGood
}

export async function getGoodsForUser(userId) {
    // const avgScores = await Review.findAll({
    //     attributes: ['goodId', [Sequelize.fn('AVG', Sequelize.col('score')), 'averageScore']],
    //     group: ['goodId'],
    // });
    
    const goods = await Good.findAll({
        where: { seller_id: userId },
        attributes: ["id", "title", "description", "price", "imageUrl", 'available',
        [Sequelize.fn("avg", Sequelize.col("reviews.score")), "averageScore"]],
        group: ['title', 'Categories.text'],
        include: [
            {
                attributes: [
                    'username', 
                    'email',
                ],
                model: User,
                as: 'seller'
            },
            {
                model: Category,
                attributes: ['text'],
            },
            {
                model: Review,
                as: "reviews",
                attributes: {exclude: ["id", "text"]},
            },
        ],
    });

    // const goodsWithAvgScores = goods.map((good) => {
    //     const avgScore = avgScores.find((avg) => avg.goodId === good.id)?.dataValues.averageScore || null;
        return goods;
    };


export async function deleteGood(id) {
    console.log("==========================================\n\n")
    console.log("Destroying good with id: ", id)
    return await Good.destroy({ where: { id } })
}
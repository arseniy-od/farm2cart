import { Sequelize } from 'sequelize';
import BaseContext from '../baseContext';
// import { User, Review, Good, Order, OrderGood, Category, CategoryGood, Company } from '@/server/database/models'
// import sequelize from '@/server/database/models/connection';


export default class GoodService extends BaseContext {
    
    private Good = this.di.Good;
    private User = this.di.User;
    private Review = this.di.Review;
    private Category = this.di.Category;
    private Order = this.di.Order;

    private goodOpts = {
        attributes: ["id", "title", "description", "price", "imageUrl", "available", "active",
            [Sequelize.fn("avg", Sequelize.col("reviews.score")), "averageScore"],
            [Sequelize.fn("count", Sequelize.col("reviews.id")), "reviewsCount"]],
            group: ['good.id', 'title', 'Categories.text', 'Categories.id'],
            include: [
                {
                    attributes: [
                        'id',
                        'username',
                        'email',
                    ],
                    model: this.User,
                    as: 'seller'
                },
                {
                    model: this.Category,
                    attributes: ['text'],
                },
                {
                    model: this.Review,
                    as: "reviews",
                    attributes: [],
                },
            ],
    }

    async getGoods() {    
        const goods = await this.Good.findAll({
            where: {active: 1},
            ...this.goodOpts
        });
        return goods;
    }

    async findGoodById(id: string) {
        const good = await this.Good.findOne(
            {
                where: { id },
                include: [
                    {
                        attributes: ['id', 'username', 'email'],
                        model: this.User,
                        as: 'seller'
                    },
                    {
                        model: this.Order,
                        attributes: ['id'],
                    },
                    {
                        model: this.Category,
                        attributes: ['text'],
                    },
                    {
                        model: this.Review,
                        as: "reviews",
                        attributes: ['text', 'authorId', 'score', 'datepub'],
                        include: [
                            {
                                model: this.User,
                                attributes: ['id', 'username'],
                                as: "author"
                            }
                        ],
                    }
                ]
            }
        )
    
        const avgScore = await this.Review.findOne({
            attributes: [[Sequelize.fn('AVG', Sequelize.col('score')), 'averageScore']],
            where: {
                goodId: id,
            },
        });
        if (good) { return {...JSON.parse(JSON.stringify(good)), ...JSON.parse(JSON.stringify(avgScore))}}
        return { error: true, message: "Good not found" }
    }
    
    // async getAllGoodIds() {
    //     const goods = await this.Good.findAll()
    //     return goods.map(good => {
    //         return {
    //             params: {
    //                 id: good.id.toString()
    //             }
    //         }
    //     })
    // }
    
    async createGood(goodData) {
        const newGood = await this.Good.create(goodData);
        await goodData.categories.forEach(async catId => {
            const categoryGood = await this.Category.findOne({ where: { id: catId } })
            await newGood.addCategory(categoryGood)
        })
        if (goodData.NewCategory) {
            const NewCategory = await this.Category.create({text: goodData.NewCategory})
            await newGood.addCategory(NewCategory)
        }
        return newGood
    }
    
    async getGoodsForUser(userId) { 
        const goods = await this.Good.findAll({
            where: { seller_id: userId },
            ...this.goodOpts
        });
            return goods;
        };
    
    
    async deleteGood(id) {
        console.log('======================================')
        console.log("Desactivating good with id: ", id)
        const good = await this.Good.findOne({ where: { id } })
        good.active = 0
        await good.save();
        return good
    }

}



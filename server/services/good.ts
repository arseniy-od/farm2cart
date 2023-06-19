import { Sequelize } from 'sequelize';

import BaseContext from '../baseContext';
import { category, good } from '@/app/interfaces';


export default class GoodService extends BaseContext {
    
    private Good = this.di.Good;
    private User = this.di.User;
    private Review = this.di.Review;
    private Category = this.di.Category;
    private Order = this.di.Order;


    async getGoods() {    
        
        const goods = await this.Good.findAll({
            where: {active: 1},
            attributes: [
                "id", "title", "description", "price", "imageUrl", "available", "active",
                [Sequelize.fn("avg", Sequelize.col("reviews.score")), "averageScore"],
                [Sequelize.fn("count", Sequelize.col("reviews.id")), "reviewsCount"]
            ],
            group: ['good.id', 'title', 'categories.text', 'categories.id'],
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
        });
        return goods;
    }

    async getGoodById(id: string) {
        const good = await this.Good.findOne({
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
                                attributes: ['id', 'username', 'email'],
                                as: "author"
                            }
                        ],
                    }
                ]
            }
        )
    
        const aggregatedReview = await this.Review.findOne({
            attributes: [[Sequelize.fn('AVG', Sequelize.col('score')), 'averageScore'], [Sequelize.fn("count", Sequelize.col("id")), "reviewsCount"]],
            where: {
                goodId: id,
            },
        });
        if (good) { return {...JSON.parse(JSON.stringify(good)), ...JSON.parse(JSON.stringify(aggregatedReview))}}
        return { error: true, message: "Good not found" }
    }

    async createGood(goodData: good & {NewCategory?: string}) {
        const newGood = await this.Good.create(goodData);
        await goodData.categories.forEach(async catId => {
            const categoryGood = await this.Category.findOne({ where: { id: catId } })
            if (categoryGood) {
                await newGood.addCategory(categoryGood)
            }
        })
        if (goodData.NewCategory) {
            const NewCategory = await this.Category.create({text: goodData.NewCategory})
            await newGood.addCategory(NewCategory)
        }
        return newGood
    }
    
    async getGoodsBySellerId(id: number|string) { 
        const goods = await this.Good.findAll({
            where: { seller_id: id },
            attributes: [
                "id", "title", "description", "price", "imageUrl", "available", "active",
                [Sequelize.fn("avg", Sequelize.col("reviews.score")), "averageScore"],
                [Sequelize.fn("count", Sequelize.col("reviews.id")), "reviewsCount"]
            ],
            group: ['good.id', 'title', 'categories.text', 'categories.id'],
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
        });
            return goods;
        };
    
    
    async deleteGood(id: string) {
        console.log("Deactivating good with id: ", id)
        const good = await this.Good.findOne({ where: { id } })
        if (good) {
            good.active = false
            await good.save();
        } else {
            console.error("Good not found")
        }
        return good
    }

}



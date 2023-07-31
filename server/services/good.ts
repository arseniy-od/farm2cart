import { Sequelize, Op } from 'sequelize'

import BaseContext from '../baseContext'
import { category, good } from '@/app/types/interfaces'
import { jsonCopy } from '@/app/utils'
import {
    CATEGORY_GOODS_TABLE,
    GOODS_PER_PAGE,
    GOODS_TABLE,
    USER_GOODS_TABLE,
} from '@/app/constants'

interface ErrorType {
    error: boolean
    message: string
}
export default class GoodService extends BaseContext {
    private Good = this.di.Good
    private User = this.di.User
    private Review = this.di.Review
    private Category = this.di.Category
    private Order = this.di.Order
    private CategoryGood = this.di.CategoryGood
    private CategoryService = this.di.CategoryService

    async getPaginatedGoodsWithFilters(
        page: number,
        searchQuery: string,
        categorySlug?: string,
        currentUser?: boolean | string,
        userId?: number,
        identityId?: number
    ) {
        if (currentUser) {
            userId = identityId
        }
        if (userId) {
            const goods = await this.getGoodsBySellerId(
                page,
                userId,
                searchQuery
            )
            goods.pageName = USER_GOODS_TABLE
            return goods
        }
        if (categorySlug) {
            const category = await this.CategoryService.getCategoryByText(
                categorySlug
            )
            if (category && 'error' in category) {
                return category
            }

            const goods = await this.getGoodsByCategoryId(
                page,
                category?.id || 0,
                searchQuery
            )
            goods.pageName = CATEGORY_GOODS_TABLE
            return goods
        }
        const goods = await this.getPaginatedGoods(page, searchQuery)

        goods.pageName = GOODS_TABLE
        return goods
    }

    async getPaginatedGoods(page: number, searchQuery: string) {
        const goods = await this.Good.findAndCountAll({
            where: {
                active: 1,
                available: { [Op.ne]: 0 },
                title: { [Op.like]: `%${searchQuery}%` },
            },
            attributes: [
                'id',
                'title',
                'description',
                'price',
                'imageUrl',
                'available',
                'active',
                [
                    Sequelize.fn('avg', Sequelize.col('reviews.score')),
                    'averageScore',
                ],
                [
                    Sequelize.fn('count', Sequelize.col('reviews.id')),
                    'reviewsCount',
                ],
            ],
            group: ['good.id', 'title'],
            include: [
                {
                    model: this.User,
                    attributes: ['id', 'username', 'email'],
                    as: 'seller',
                },

                {
                    model: this.Review,
                    as: 'reviews',
                    attributes: [],
                },
            ],
            order: [['id', 'ASC']],
            offset: (page - 1) * GOODS_PER_PAGE,
            limit: GOODS_PER_PAGE,
            subQuery: false,
        })
        return { count: goods.count.length, result: goods.rows, pageName: '' }
    }

    async getGoodByIdExtended(id?: string | string[]) {
        if (!id || id instanceof Array) {
            return {
                error: true,
                message: 'id not found or id is an instance of array',
            }
        }
        const good = await this.Good.findOne({
            where: { id },
            include: [
                {
                    attributes: ['id', 'username', 'email'],
                    model: this.User,
                    as: 'seller',
                },
                {
                    model: this.Order,
                    attributes: ['id'],
                },
                {
                    model: this.Category,
                    attributes: ['id', 'text'],
                    through: { attributes: ['id', 'categoryId', 'goodId'] },
                },
                {
                    model: this.Review,
                    as: 'reviews',
                    attributes: ['id', 'text', 'authorId', 'score', 'datepub'],
                    include: [
                        {
                            model: this.User,
                            attributes: ['id', 'username', 'email'],
                            as: 'author',
                        },
                    ],
                },
            ],
        })
        const aggregatedReview = await this.Review.findOne({
            attributes: [
                [Sequelize.fn('AVG', Sequelize.col('score')), 'averageScore'],
                [Sequelize.fn('count', Sequelize.col('id')), 'reviewsCount'],
            ],
            where: {
                goodId: id,
            },
        })
        if (good) {
            return {
                ...JSON.parse(JSON.stringify(good)),
                ...JSON.parse(JSON.stringify(aggregatedReview)),
            }
        }
        return { error: true, notFound: true, message: 'Good not found' }
    }

    async getGoodById(id: string | number) {
        const good = await this.Good.findOne({
            where: { id },
        })
        return good
    }

    async getAllGoodIds() {
        const goods = await this.Good.findAll()
        return goods.map((good) => ({ params: { id: good.id.toString() } }))
    }

    async createGood({ body, identity, file }) {
        if (!identity) {
            return { error: true, message: 'You are not logged in' }
        }
        const goodData = { ...body, seller_id: identity.id }
        if (!(goodData.categories instanceof Array)) {
            goodData.categories = [goodData.categories]
        }

        if (file) {
            goodData.imageUrl = file.path.replace('public', '')
        }

        const newGood = await this.Good.create(goodData)
        await goodData.categories.forEach(async (catId) => {
            const categoryGood = await this.Category.findOne({
                where: { id: catId },
            })
            if (categoryGood) {
                await newGood.addCategory(categoryGood)
            }
        })
        return newGood
    }

    async updateGood({ body, identity, file }) {
        if (!identity) {
            return { error: true, message: 'You are not logged in' }
        }
        const goodData = { ...body }
        const currentGood = await this.getGoodById(goodData.id)
        if (currentGood?.seller_id !== identity.id) {
            return { error: true, message: 'You are not owner of this good' }
        }
        if (!(goodData.categories instanceof Array)) {
            goodData.categories = [goodData.categories]
        }

        if (file) {
            console.log('File:', file)
            goodData.imageUrl = file.path.replace('public', '')
        }

        const good = await this.Good.findByPk(goodData.id)

        if (!good) {
            return { error: true, message: 'Good not found' }
        }
        await good.update(goodData)

        await good.setCategories([])
        await goodData.categories.forEach(async (catId) => {
            const categoryGood = await this.Category.findOne({
                where: { id: catId },
            })
            if (categoryGood) {
                await good.addCategory(categoryGood)
            }
        })
        return good
    }

    async patchGood({ body, identity, file, query }) {
        if (!identity) {
            return { error: true, message: 'You are not logged in' }
        }

        const goodData = { ...body, id: query.id, active: true }

        const currentGood = await this.getGoodById(goodData.id)

        if (currentGood?.seller_id !== identity.id) {
            return { error: true, message: 'You are not owner of this good' }
        }

        // console.log('[api/goods] goodData before: ', goodData)
        if (!(goodData.categories instanceof Array) && goodData.categories) {
            goodData.categories = [goodData.categories]
        }
        // console.log('[api/goods] goodData after:', goodData)

        if (file) {
            console.log('File:', file)
            goodData.imageUrl = file.path.replace('public', '')
        }
        const good = await this.Good.findByPk(goodData.id)
        if (!good) {
            return { error: true, message: 'Good not found' }
        }
        await good.update(goodData)
        if (goodData.categories?.length) {
            await goodData.categories.forEach(async (catId) => {
                const categoryGood = await this.Category.findOne({
                    where: { id: catId },
                })
                if (categoryGood) {
                    await good.addCategory(categoryGood)
                }
            })
        }
        return good
    }

    async getGoodsBySellerId(
        page: number,
        id: number | string,
        searchQuery: string
    ) {
        const goods = await this.Good.findAndCountAll({
            where: { seller_id: id, title: { [Op.like]: `%${searchQuery}%` } },
            attributes: [
                'id',
                'title',
                'description',
                'price',
                'imageUrl',
                'available',
                'active',
                [
                    Sequelize.fn('avg', Sequelize.col('reviews.score')),
                    'averageScore',
                ],
                [
                    Sequelize.fn('count', Sequelize.col('reviews.id')),
                    'reviewsCount',
                ],
            ],
            group: ['good.id', 'title'],
            include: [
                {
                    model: this.User,
                    attributes: ['id', 'username', 'email'],
                    as: 'seller',
                },
                {
                    model: this.Review,
                    as: 'reviews',
                    attributes: [],
                },
            ],
            order: [['id', 'ASC']],
            offset: (page - 1) * GOODS_PER_PAGE,
            limit: GOODS_PER_PAGE,
            subQuery: false,
        })
        return { count: goods.count.length, result: goods.rows, pageName: '' }
        // return goods
    }

    async getGoodsByCategoryId(
        page: number,
        id: number | string,
        searchQuery: string
    ) {
        const goods = await this.Good.findAndCountAll({
            where: {
                // active: 1,
                available: { [Op.ne]: 0 },
                title: { [Op.like]: `%${searchQuery}%` },
            },
            attributes: [
                'id',
                'title',
                'description',
                'price',
                'imageUrl',
                'available',
                'active',
                [
                    Sequelize.fn('avg', Sequelize.col('reviews.score')),
                    'averageScore',
                ],
                [
                    Sequelize.fn('count', Sequelize.col('reviews.id')),
                    'reviewsCount',
                ],
            ],
            group: ['good.id', 'title'],
            include: [
                {
                    model: this.Category,
                    where: { id },
                    attributes: ['id', 'text'],
                    through: { attributes: [] },
                },
                {
                    model: this.User,
                    attributes: ['id', 'username', 'email'],
                    as: 'seller',
                },
                {
                    model: this.Review,
                    as: 'reviews',
                    attributes: [],
                },
            ],
            order: [['id', 'ASC']],
            offset: (page - 1) * GOODS_PER_PAGE,
            limit: GOODS_PER_PAGE,
            subQuery: false,
        })
        return { count: goods.count.length, result: goods.rows, pageName: '' }
        // return goods
    }

    async deleteGood(id?: string | string[]) {
        if (id && typeof id === 'string') {
            const good = await this.Good.findOne({ where: { id } })
            if (good) {
                good.active = false
                await good.save()
            } else {
                console.error('Good not found')
                return {
                    error: true,
                    notFound: true,
                    message: 'Good not found',
                }
            }
            return good
        } else {
            return { error: true, message: 'id not found or id is an array' }
        }
    }
}

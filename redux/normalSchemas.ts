import { good } from '@/app/types/interfaces'
import { schema } from 'normalizr'

export const categoryGoodSchema = new schema.Entity('categoryGoods')
export const orderGoodsSchema = new schema.Entity('orderGoods')

export const goodMinSchema = new schema.Entity('goods', {
    CategoryGood: categoryGoodSchema,
})

export const userSchema = new schema.Entity('users')
export const reviewSchema = new schema.Entity('reviews', { author: userSchema })

export const categorySchema = new schema.Entity('categories', {
    CategoryGood: categoryGoodSchema,
    goods: [goodMinSchema],
})

export const goodSchema = new schema.Entity<good>('goods', {
    seller: userSchema,
    categories: [categorySchema],
    reviews: [reviewSchema],
    OrderGood: orderGoodsSchema,
})

export const goodsSchema = [goodSchema]

export const orderSchema = new schema.Entity('orders', {
    OrderGoods: [orderGoodsSchema],
    goods: goodsSchema,
})

export const ordersSchema = [orderSchema]

export const categoriesSchema = [categorySchema]

import { schema, normalize } from 'normalizr'

const categoryGoodSchema = new schema.Entity('categoryGoods')
const categorySchema = new schema.Entity('categories', {
    CategoryGood: categoryGoodSchema,
})

const user = new schema.Entity('users')
const reviewSchema = new schema.Entity('reviews', { author: user })
export const goodSchema = new schema.Entity('goods', {
    seller: user,
    categories: [categorySchema],
    reviews: [reviewSchema],
})
export const goodsSchema = [goodSchema]
export const categoriesSchema = [categorySchema]

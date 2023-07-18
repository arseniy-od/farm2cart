import { asClass } from 'awilix'
import CategoryEntity from './category'
import ReviewEntity from './review'
import OrderEntity from './order'
import AuthEntity from './auth'
import CartEntity from './cart'
import GoodEntity from './good'

export interface IEntityContainer {
    CategoryEntity: CategoryEntity
    ReviewEntity: ReviewEntity
    OrderEntity: OrderEntity
    AuthEntity: AuthEntity
    CartEntity: CartEntity
    GoodEntity: GoodEntity
}

const entities = {
    CategoryEntity: asClass(CategoryEntity).singleton(),
    ReviewEntity: asClass(ReviewEntity).singleton(),
    OrderEntity: asClass(OrderEntity).singleton(),
    AuthEntity: asClass(AuthEntity).singleton(),
    CartEntity: asClass(CartEntity).singleton(),
    GoodEntity: asClass(GoodEntity).singleton(),
}

export default entities

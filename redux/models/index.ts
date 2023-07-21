import { asClass } from 'awilix'
import CategoryEntity from './category'
import ReviewEntity from './review'
import OrderEntity from './order'
import AuthEntity from './auth'
import CartEntity from './cart'
import GoodEntity from './good'
import PageEntity from './page'

export interface IEntityContainer {
    CategoryEntity: CategoryEntity
    ReviewEntity: ReviewEntity
    OrderEntity: OrderEntity
    AuthEntity: AuthEntity
    CartEntity: CartEntity
    GoodEntity: GoodEntity
    PageEntity: PageEntity
}

const entities = {
    CategoryEntity: asClass(CategoryEntity).singleton(),
    ReviewEntity: asClass(ReviewEntity).singleton(),
    OrderEntity: asClass(OrderEntity).singleton(),
    AuthEntity: asClass(AuthEntity).singleton(),
    CartEntity: asClass(CartEntity).singleton(),
    GoodEntity: asClass(GoodEntity).singleton(),
    PageEntity: asClass(PageEntity).singleton(),
}

export default entities

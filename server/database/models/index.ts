import { asFunction } from 'awilix'

import UserModel, { UserType } from './user'
// import CompanyModel, {CompanyType} from './company'
import GoodModel, { GoodType } from './good'
import ReviewModel, { ReviewType } from './review'
import CategoryModel, { CategoryType } from './category'
import CategoryGoodModel, { CategoryGoodType } from './categorygood'
import OrderGoodModel, { OrderGoodType } from './ordergood'
import OrderModel, { OrderType } from './order'

export interface IModelContainer {
    User: UserType
    Good: GoodType
    Review: ReviewType
    CategoryGood: CategoryGoodType
    Category: CategoryType
    OrderGood: OrderGoodType
    Order: OrderType
}

const modelContainer = {
    User: asFunction(UserModel).singleton(),
    Good: asFunction(GoodModel).singleton(),
    Review: asFunction(ReviewModel).singleton(),
    CategoryGood: asFunction(CategoryGoodModel).singleton(),
    Category: asFunction(CategoryModel).singleton(),
    OrderGood: asFunction(OrderGoodModel).singleton(),
    Order: asFunction(OrderModel).singleton(),
}

export default modelContainer

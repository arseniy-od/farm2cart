import { asClass } from 'awilix'
import CompanyController from './company'
import UserController from './user'
import GoodController from './good'
import OrderController from './order'
import ReviewController from './review'
import CategoryController from './category'

export interface IControllerContainer {
    CompanyController: CompanyController
    UserController: UserController
    GoodController: GoodController
    OrderController: OrderController
    ReviewController: ReviewController
    CategoryController: CategoryController
}

const controllers = {
    CompanyController: asClass(CompanyController).singleton(),
    UserController: asClass(UserController).singleton(),
    GoodController: asClass(GoodController).singleton(),
    OrderController: asClass(OrderController).singleton(),
    ReviewController: asClass(ReviewController).singleton(),
    CategoryController: asClass(CategoryController).singleton(),
}

export default controllers

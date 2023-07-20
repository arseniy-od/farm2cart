import { asClass } from 'awilix'
import UserController from './user'
import GoodController from './good'
import OrderController from './order'
import ReviewController from './review'
import CategoryController from './category'
import AuthController from './auth'
import CartController from './cart'

export interface IControllerContainer {
    AuthController: AuthController
    UserController: UserController
    GoodController: GoodController
    OrderController: OrderController
    ReviewController: ReviewController
    CategoryController: CategoryController
    CartController: CartController
}

const controllers = {
    AuthController: asClass(AuthController).singleton(),
    UserController: asClass(UserController).singleton(),
    GoodController: asClass(GoodController).singleton(),
    OrderController: asClass(OrderController).singleton(),
    ReviewController: asClass(ReviewController).singleton(),
    CategoryController: asClass(CategoryController).singleton(),
    CartController: asClass(CartController).singleton(),
}

export default controllers

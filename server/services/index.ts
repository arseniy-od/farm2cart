import { asClass } from 'awilix'
import UserService from './user'
import GoodService from './good'
import CategoryService from './category'
import OrderService from './order'
import ReviewService from './review'
import CartService from './cart'

export interface IServicesContainer {
    UserService: UserService
    GoodService: GoodService
    ReviewService: ReviewService
    CategoryService: CategoryService
    OrderService: OrderService
    CartService: CartService
}

const services = {
    UserService: asClass(UserService).singleton(),
    GoodService: asClass(GoodService).singleton(),
    ReviewService: asClass(ReviewService).singleton(),
    CategoryService: asClass(CategoryService).singleton(),
    OrderService: asClass(OrderService).singleton(),
    CartService: asClass(CartService).singleton(),
}

export default services

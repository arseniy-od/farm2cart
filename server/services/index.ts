import { asClass } from 'awilix';
import UserService from './user';
import CompanyService from './company';
import GoodService from './good';
import CategoryService from './category';
import OrderService from './order';
import ReviewService from './review'

export interface IServicesContainer {
    UserService: UserService;
    CompanyService: CompanyService;
    GoodService: GoodService;
    ReviewService: ReviewService;
    CategoryService: CategoryService;
    OrderService: OrderService;
}

const services = {
    UserService: asClass(UserService).singleton(),
    CompanyService: asClass(CompanyService).singleton(),
    GoodService: asClass(GoodService).singleton(),
    ReviewService: asClass(ReviewService).singleton(),
    CategoryService: asClass(CategoryService).singleton(),
    OrderService: asClass(OrderService).singleton()
};

export default services
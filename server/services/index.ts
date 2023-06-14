import { asClass } from 'awilix';
import ProductService from './product';
import ReviewService from './review';
import StoreService from './store';
import UserService from './user';

export interface IServicesContainer {
    UserService: UserService;
    StoreService: StoreService
    ReviewService: ReviewService
    ProductService: ProductService
}

export default {
    UserService: asClass(UserService).singleton(),
    StoreService: asClass(StoreService).singleton(),
    ReviewService: asClass(ReviewService).singleton(),
    ProductService: asClass(ProductService).singleton(),
};
import { asClass } from 'awilix'
import CompanyController from './company'
import UserController from './user'
import GoodController from './good'

export interface IControllerContainer {
    CompanyController: CompanyController
    UserController: UserController
    GoodController: GoodController
}

const controllers = {
    CompanyController: asClass(CompanyController).singleton(),
    UserController: asClass(UserController).singleton(),
    GoodController: asClass(GoodController).singleton(),
}

export default controllers

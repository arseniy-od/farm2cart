import { asFunction } from 'awilix'

import UserModel from './user'
import CompanyModel from './company'
import GoodModel from './good'
import ReviewModel from './review'
import CategoryModel from './category'
import CategoryGoodModel from './categorygood'
import OrderGoodModel from './ordergood'
import OrderModel from './order'




const modelContainer = {
    Company: asFunction(CompanyModel).singleton(),
    User: asFunction(UserModel).singleton(),
    Good: asFunction(GoodModel).singleton(),
    Review: asFunction(ReviewModel).singleton(),
    CategoryGood: asFunction(CategoryGoodModel).singleton(),
    Category: asFunction(CategoryModel).singleton(),
    OrderGood: asFunction(OrderGoodModel).singleton(),
    Order: asFunction(OrderModel).singleton()
};

export default modelContainer


//! Old

// import User from './user'
// import Good from './good'
// import Review from "./review"
// import Order from "@/server/database/models/order";
// import OrderGood from "@/server/database/models/ordergood";
// import Company from "@/server/database/models/company";
// import Category from "@/server/database/models/category";
// import CategoryGood from "@/server/database/models/categorygood";


// // One to many
// User.hasMany(Good, { foreignKey: 'seller_id', as: 'goods', }); //+
// Good.belongsTo(User, { foreignKey: 'seller_id', as: 'seller', }); //+

// User.hasMany(Review, { foreignKey: 'authorId', as: 'reviews' }); // + 
// Review.belongsTo(User, { foreignKey: 'authorId', as: 'author' }); // +

// User.hasMany(Order, { foreignKey: 'customerId', as: 'orders' });
// Order.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });

// Good.hasMany(Review, { foreignKey: 'goodId', as: 'reviews' }); // +
// Review.belongsTo(Good, { foreignKey: 'goodId', as: 'good' }); // +

// Company.hasMany(User, { foreignKey: 'companyId', as: 'sellers' }); //+
// User.belongsTo(Company, { foreignKey: 'companyId', as: 'company' }) //+

// //Many to many
// Order.belongsToMany(Good, { through: 'OrderGood' });
// Good.belongsToMany(Order, { through: 'OrderGood' });

// Category.belongsToMany(Good, { through: 'CategoryGood' });
// Good.belongsToMany(Category, { through: 'CategoryGood' });


// export { User, Good, Review, Category, CategoryGood, Company, OrderGood, Order };



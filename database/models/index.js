import User from './user'
import Good from './good'
import Review from "./review"
import Order from "@/database/models/order";
import OrderGood from "@/database/models/ordergood";
import Company from "@/database/models/company";
import Category from "@/database/models/category";
import CategoryGood from "@/database/models/categorygood";

// One to many
User.hasMany(Good, {foreignKey: 'seller_id', as: 'goods',});
Good.belongsTo(User, {foreignKey: 'seller_id', as: 'seller',});

User.hasMany(Review, {foreignKey: 'authorId', as: 'reviews'});
Review.belongsTo(User, {foreignKey: 'authorId', as: 'author'});

Good.hasMany(Review, {foreignKey: 'goodId', as: 'reviews'});
Review.belongsTo(Good, {foreignKey: 'goodId', as: 'good'});

Company.hasMany(User, {foreignKey: 'company_id', as: 'sellers'});
User.belongsTo(Company, {foreignKey: 'company_id', as: 'company'})

//Many to many
Order.belongsToMany(Good, { through: 'OrderGood' });
Good.belongsToMany(User, { through: 'OrderGood' });

Category.belongsToMany(Good, { through: 'CategoryGood' });
Good.belongsToMany(Category, { through: 'CategoryGood' });


export {User, Good, Review, Category, CategoryGood, Company, OrderGood, Order};

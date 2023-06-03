import User from './user'
import Good from './good'
import Review from "./review"
import Order from "@/database/models/order";
import OrderGood from "@/database/models/ordergood";
import Company from "@/database/models/company";
import Category from "@/database/models/category";
import CategoryGood from "@/database/models/categorygood";


User.hasMany(Good, {
  foreignKey: 'seller_id',
  as: 'goods',
});

Good.belongsTo(User, {
  foreignKey: 'seller_id',
  as: 'seller',
});


export {User, Good, Review, Category, CategoryGood, Company, OrderGood, Order};

import { Model, DataTypes } from "sequelize";


const CategoryModel = (ctx) => {
  const Category = ctx.db.define('Category', {
    text: DataTypes.STRING
  },
    {
      tableName: 'categories',
      timestamps: false,
    }
  );
  
  Category.belongsToMany(ctx.Good, { through: ctx.CategoryGood });
  ctx.Good.belongsToMany(Category, { through: ctx.CategoryGood });
  return Category
}

export default CategoryModel





//! Old
// import { Model, DataTypes } from "sequelize";
// import sequelize from './connection'


// export default class Category extends Model { }
// Category.init({
//   text: DataTypes.STRING
// }, {
//   sequelize,
//   modelName: 'Category',
//   tableName: 'categories',
//   timestamps: false,
// });

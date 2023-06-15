import { Model, DataTypes } from "sequelize";


const CategoryGoodModel = (ctx) => {
  const CategoryGood = ctx.db.define('CategoryGood', {
    categoryId: DataTypes.INTEGER,
    goodId: DataTypes.INTEGER
  },
    {
      tableName: 'category_good',
      timestamps: false,
    }
  );
  return CategoryGood
}

export default CategoryGoodModel





// import {Model, DataTypes} from "sequelize";
// import sequelize from './connection'


// export default class CategoryGood extends Model {}
// CategoryGood.init({
//   categoryId: DataTypes.INTEGER,
//   goodId: DataTypes.INTEGER
// }, {
//   sequelize,
//   modelName: 'CategoryGood',
//   tableName: 'category_good',
//   timestamps: false,
// });

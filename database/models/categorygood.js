import {Model, DataTypes} from "sequelize";
import sequelize from './connection'


export default class CategoryGood extends Model {}
CategoryGood.init({
  categoryId: DataTypes.INTEGER,
  goodId: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'CategoryGood',
});

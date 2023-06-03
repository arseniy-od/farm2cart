import {Model, DataTypes} from "sequelize";
import sequelize from './connection'


export default class Review extends Model {}
Review.init({
  goodId: DataTypes.INTEGER,
  text: DataTypes.TEXT,
  score: DataTypes.FLOAT,
  authorId: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'Review',
});

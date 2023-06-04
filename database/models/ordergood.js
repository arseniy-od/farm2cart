import {Model, DataTypes} from "sequelize";
import sequelize from './connection'


export default class OrderGood extends Model {}
OrderGood.init({
  quantity: {type: DataTypes.INTEGER, allowNull: false,},
}, {
  sequelize,
  modelName: 'OrderGood',
  timestamps: false
});

import {Model, DataTypes} from "sequelize";
import sequelize from './connection'


class OrderGood extends Model {}
OrderGood.init({
  orderId: DataTypes.INTEGER,
  goodId: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'OrderGood',
});

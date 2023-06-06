import {Model, DataTypes} from "sequelize";
import sequelize from './connection'


export default class Order extends Model {}

Order.init({
  customerId: DataTypes.INTEGER,
  total: DataTypes.FLOAT,
  paymentStatus: DataTypes.STRING
}, {
  sequelize,
  modelName: 'order',
  timestamps: false,
});

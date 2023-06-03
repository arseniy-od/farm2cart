import {Model, DataTypes} from "sequelize";
import sequelize from './connection'


export default class Good extends Model {}
Good.init({
  title: {type: DataTypes.STRING, allowNull: false},
  imageUrl: DataTypes.STRING,
  description: DataTypes.TEXT,
  price: {type: DataTypes.FLOAT, allowNull:false},
  seller_id: {type: DataTypes.INTEGER, allowNull: false}
}, {
  sequelize,
  modelName: 'good',
});

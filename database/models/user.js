import {Model, DataTypes} from "sequelize";
import sequelize from './connection'


export default class User extends Model {}
User.init({
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  email: DataTypes.STRING,
  phoneNumber: DataTypes.STRING,
  role: DataTypes.STRING,
  companyId: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'user',
  timestamps: false,
});

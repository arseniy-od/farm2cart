import {Model, DataTypes} from "sequelize";
import sequelize from './connection'



export default class User extends Model {}
User.init({
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  email: {
    type: DataTypes.STRING, 
    validate: {isEmail: true}
  },
  phoneNumber: DataTypes.STRING,
  role: {type: DataTypes.STRING, 
    validate: {isIn: [['customer', 'seller', 'admin']]}
  },
  companyId: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'user',
  timestamps: false,
});

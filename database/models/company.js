import {Model, DataTypes} from "sequelize";
import sequelize from './connection'


export default class Company extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
Company.init({
  name: {type: DataTypes.STRING, allowNull: false},
  description: DataTypes.TEXT,
  address: DataTypes.STRING,
  email: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Company',
});

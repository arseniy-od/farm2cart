import {Model, DataTypes} from "sequelize";
import sequelize from './connection'


export default class Category extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
Category.init({
  text: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Category',
});

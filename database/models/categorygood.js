'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CategoryGood extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CategoryGood.init({
    categoryId: DataTypes.INTEGER,
    goodId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CategoryGood',
  });
  return CategoryGood;
};
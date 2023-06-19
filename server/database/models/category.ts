import {BuildOptions, Model, DataTypes, CreationOptional } from "sequelize";
import { IContextContainer } from '../../container';
import { InferAttributes, InferCreationAttributes } from "sequelize";
import { IGoodModel } from "./good";


export interface ICategoryModel extends Model<InferAttributes<ICategoryModel>, InferCreationAttributes<ICategoryModel>> {
  id: CreationOptional<number>;
  text: string
}

export type CategoryType = typeof Model & {
  new (values?: object, options?: BuildOptions): ICategoryModel;
}


const CategoryModel = (ctx: IContextContainer) => {
  const Category = <CategoryType>ctx.db.define<ICategoryModel>('category', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    text: DataTypes.STRING
  },
    {
      tableName: 'categories',
      timestamps: false,
    }
  );
  
  Category.belongsToMany(ctx.Good, { through: ctx.CategoryGood });
  ctx.Good.belongsToMany(Category, { through: ctx.CategoryGood });
  return Category
}

export default CategoryModel


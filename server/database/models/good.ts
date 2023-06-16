import { BuildOptions, Model, DataTypes } from "sequelize";
import { InferAttributes, InferCreationAttributes } from "sequelize";

import { IContextContainer } from '../../container';


export interface IGoodModel extends Model<InferAttributes<IGoodModel>, InferCreationAttributes<IGoodModel>> {
  title: string
  imageUrl: string
  description: string
  price: number
  seller_id: number
  available: number
  active: boolean
}


export type GoodType = typeof Model & {
  new(values?: object, options?: BuildOptions): IGoodModel;
}


const GoodModel = (ctx: IContextContainer) => {
  const Good = <GoodType>ctx.db.define<IGoodModel>('good', {
    title: {type: DataTypes.STRING, allowNull: false},
    imageUrl: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: {type: DataTypes.FLOAT, allowNull:false},
    seller_id: {type: DataTypes.INTEGER, allowNull: false},
    available: {type: DataTypes.INTEGER, allowNull: false},
    active: {type: DataTypes.TINYINT, allowNull: false}
  }, {});

  ctx.User.hasMany(Good, { foreignKey: 'seller_id', as: 'goods', });
  Good.belongsTo(ctx.User, { foreignKey: 'seller_id', as: 'seller', });
  return Good
}

export default GoodModel

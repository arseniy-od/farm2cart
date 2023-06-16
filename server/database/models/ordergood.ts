import { BuildOptions, Model, DataTypes } from "sequelize";
import { InferAttributes, InferCreationAttributes } from "sequelize";

import { IContextContainer } from '../../container';


export interface IOrderGoodModel extends Model<InferAttributes<IOrderGoodModel>, InferCreationAttributes<IOrderGoodModel>> {
  quantity: number
}


export type OrderGoodType = typeof Model & {
  new(values?: object, options?: BuildOptions): IOrderGoodModel
}


const OrderGoodModel = (ctx: IContextContainer) => {
  const OrderGood = <OrderGoodType>ctx.db.define<IOrderGoodModel>('OrderGood', {
    quantity: {type: DataTypes.INTEGER, allowNull: false,},
  },
    {
      tableName: 'order_goods',
      timestamps: false,
    }
  );
  return OrderGood
}

export default OrderGoodModel

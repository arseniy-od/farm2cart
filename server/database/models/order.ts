import { BuildOptions, Model, DataTypes } from "sequelize";
import { InferAttributes, InferCreationAttributes } from "sequelize";

import { IContextContainer } from '../../container';
import { IGoodModel } from "./good";


export interface IOrderModel extends Model<InferAttributes<IOrderModel>, InferCreationAttributes<IOrderModel>>{
  customerId: number
  total: number
  paymentStatus: string
}


export type OrderType = typeof Model & {
  new(values?: object, options?: BuildOptions): IOrderModel
}


const OrderModel = (ctx: IContextContainer) => {
  const Order = <OrderType>ctx.db.define<IOrderModel>('order', {
    customerId: DataTypes.INTEGER,
    total: DataTypes.FLOAT,
    paymentStatus: DataTypes.STRING
  },
    {
      timestamps: false,
    }
  );

  Order.belongsToMany(ctx.Good, { through: ctx.OrderGood });
  ctx.Good.belongsToMany(Order, { through: ctx.OrderGood });
  return Order
}

export default OrderModel







// import { Model, DataTypes } from "sequelize";
// import sequelize from './connection'


// export default class Order extends Model { }

// Order.init({
//   customerId: DataTypes.INTEGER,
//   total: DataTypes.FLOAT,
//   paymentStatus: DataTypes.STRING
// }, {
//   sequelize,
//   modelName: 'order',
//   timestamps: false,
// });

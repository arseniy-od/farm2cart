import { Model, DataTypes } from "sequelize";


const OrderModel = (ctx) => {
  const Order = ctx.db.define('order', {
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

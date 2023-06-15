import { Model, DataTypes } from "sequelize";


const OrderGoodModel = (ctx) => {
  const OrderGood = ctx.db.define('OrderGood', {
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

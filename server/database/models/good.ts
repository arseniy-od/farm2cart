// import {Model, DataTypes} from "sequelize";
// import sequelize from './connection'
// import { InferAttributes, InferCreationAttributes } from "sequelize";

// interface User {
//   title: string
//   imageUrl: string
//   description: string
//   price: number
//   seller_id: number
// }


// export interface IGoodModel extends Model<InferAttributes<IGoodModel>, InferCreationAttributes<IGoodModel>> {
//   title: string
//   imageUrl: string
//   description: string
//   price: number
//   seller_id: number
// }



// class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {}


// export interface IUserModel extends Model<InferAttributes<IGood>, InferCreationAttributes<IGood>> {}



import { Model, DataTypes } from "sequelize";


const GoodModel = (ctx) => {
  const Good = ctx.db.define('good', {
    title: {type: DataTypes.STRING, allowNull: false},
    imageUrl: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: {type: DataTypes.FLOAT, allowNull:false},
    seller_id: {type: DataTypes.INTEGER, allowNull: false},
    available: {type: DataTypes.INTEGER, allowNull: false},
    active: {type: DataTypes.TINYINT, allowNull: false}
  },
    {
      // paranoid: true,
      // timestamps: false,
    }
  );

  ctx.User.hasMany(Good, { foreignKey: 'seller_id', as: 'goods', });
  Good.belongsTo(ctx.User, { foreignKey: 'seller_id', as: 'seller', });
  return Good
}

export default GoodModel



//! Old

// export default class Good extends Model {
//   // declare title: string
//   // imageUrl: string
//   // description: string
//   // price: number
//   // seller_id: number
// }
// Good.init({
//   title: {type: DataTypes.STRING, allowNull: false},
//   imageUrl: DataTypes.STRING,
//   description: DataTypes.TEXT,
//   price: {type: DataTypes.FLOAT, allowNull:false},
//   seller_id: {type: DataTypes.INTEGER, allowNull: false},
//   available: {type: DataTypes.INTEGER, allowNull: false}
// }, {
//   sequelize,
//   modelName: 'good',
//   paranoid: true,
//   // timestamps: false,
// });

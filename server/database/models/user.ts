import { BuildOptions, Model, DataTypes } from "sequelize";
import { InferAttributes, InferCreationAttributes } from "sequelize";

import { IContextContainer } from '../../container';


export interface IUserModel extends Model<InferAttributes<IUserModel>, InferCreationAttributes<IUserModel>> {
  firstName: string
  lastName: string
  username: string
  password: string
  email: string
  phoneNumber: string
  role: string
  companyId: number
}


export type UserType = typeof Model & {
  new(values?: object, options?: BuildOptions): IUserModel
}


const UserModel = (ctx: IContextContainer) => {
  const User = <UserType>ctx.db.define<IUserModel>('user', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: { isEmail: true }
    },
    phoneNumber: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      validate: { isIn: [['customer', 'seller', 'admin']] }
    },
    companyId: DataTypes.INTEGER
  },
    {
      timestamps: false,
    }
  );

  ctx.Company.hasMany(User, { foreignKey: 'companyId', as: 'sellers' });
  User.belongsTo(ctx.Company, { foreignKey: 'companyId', as: 'company' })
  
  return User
}

export default UserModel




//! Old

// export default class User extends Model { }
//   User.init({
//     firstName: DataTypes.STRING,
//     lastName: DataTypes.STRING,
//     username: DataTypes.STRING,
//     password: DataTypes.STRING,
//     email: {
//       type: DataTypes.STRING,
//       validate: { isEmail: true }
//     },
//     phoneNumber: DataTypes.STRING,
//     role: {
//       type: DataTypes.STRING,
//       validate: { isIn: [['customer', 'seller', 'admin']] }
//     },
//     companyId: DataTypes.INTEGER
//   }, {
//     sequelize,
//     modelName: 'user',
//     timestamps: false,
//   });


//! Copied from tg



// export type StoreType = typeof Model & {
//   new(values?: object, options?: BuildOptions): IStoreModel;
//   init(): void;
// }

// export default (ctx: IContextContainer) => {
//   const Stores = <StoreType>ctx.db.define<IStoreModel>('stores', {
//     id: {
//       allowNull: false,
//       autoIncrement: true,
//       primaryKey: true,
//       type: DataTypes.INTEGER
//     },

//     storeName: {
//       allowNull: false,
//       type: DataTypes.STRING
//     },

//     userId: {
//       allowNull: false,
//       type: DataTypes.INTEGER,
//       references: {
//         model: "users",
//         key: 'id'
//       },
//     },
//   },
//     {
//       timestamps: false
//     }
//   );

//   ctx.Users.hasMany(Stores, {
//     sourceKey: 'id',
//     foreignKey: 'userId',
//   });

//   Stores.belongsTo(ctx.Users);

//   return Stores;
// }
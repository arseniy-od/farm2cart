import { BuildOptions, Model, DataTypes, CreationOptional } from 'sequelize'
import { InferAttributes, InferCreationAttributes } from 'sequelize'

import { IContextContainer } from '../../container'

export interface IUserModel
    extends Model<
        InferAttributes<IUserModel>,
        InferCreationAttributes<IUserModel>
    > {
    id: CreationOptional<number>
    firstName: string
    lastName: string
    username: string
    password: string
    email: string
    phoneNumber: string
    role: string
    registrationDate: Date
}

export type UserType = typeof Model & {
    new (values?: object, options?: BuildOptions): IUserModel
}

const UserModel = (ctx: IContextContainer) => {
    const User = <UserType>ctx.db.define<IUserModel>(
        'user',
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            username: DataTypes.STRING,
            password: DataTypes.STRING,
            email: {
                type: DataTypes.STRING,
                validate: { isEmail: true },
            },
            phoneNumber: DataTypes.STRING,
            role: {
                type: DataTypes.STRING,
                validate: { isIn: [['customer', 'seller', 'admin']] },
            },
            registrationDate: DataTypes.DATE,
        },
        {
            timestamps: false,
        }
    )

    return User
}

export default UserModel

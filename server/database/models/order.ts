import {
    BuildOptions,
    Model,
    DataTypes,
    HasManyAddAssociationMixinOptions,
} from 'sequelize'
import {
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize'

import { IContextContainer } from '../../container'
import { IGoodModel } from './good'
import { IOrderGoodModel } from './ordergood'

export type HasManyAddAssociationMixin<TModel, TModelPrimaryKey> = (
    newAssociation?: TModel | TModelPrimaryKey,
    options?: HasManyAddAssociationMixinOptions & {
        through: { [key: string]: any }
    }
) => Promise<void>

export interface IOrderModel
    extends Model<
        InferAttributes<IOrderModel>,
        InferCreationAttributes<IOrderModel>
    > {
    id: CreationOptional<number>
    customerId: number
    total: number
    paymentStatus: string
    addGood: HasManyAddAssociationMixin<IGoodModel, number>
}

export type OrderType = typeof Model & {
    new (values?: object, options?: BuildOptions): IOrderModel
}

const OrderModel = (ctx: IContextContainer) => {
    const Order = <OrderType>ctx.db.define<IOrderModel>(
        'order',
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            customerId: DataTypes.INTEGER,
            total: DataTypes.FLOAT,
            paymentStatus: DataTypes.STRING,
        },
        {
            timestamps: false,
        }
    )

    Order.belongsToMany(ctx.Good, { through: ctx.OrderGood })
    ctx.Good.belongsToMany(Order, { through: ctx.OrderGood })
    Order.hasMany(ctx.OrderGood)
    ctx.OrderGood.belongsTo(Order)
    ctx.Good.hasMany(ctx.OrderGood)
    ctx.OrderGood.belongsTo(ctx.Good)

    Order.belongsTo(ctx.User, { foreignKey: 'customerId', as: 'customer' })
    ctx.User.hasMany(Order, { foreignKey: 'customerId', as: 'orders' })

    return Order
}

export default OrderModel

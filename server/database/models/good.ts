import {
    BuildOptions,
    Model,
    DataTypes,
    CreationOptional,
    HasManyAddAssociationMixin,
    HasManySetAssociationsMixin,
} from 'sequelize'
import { InferAttributes, InferCreationAttributes } from 'sequelize'

import { IContextContainer } from '../../container'
import { ICategoryModel } from './category'

export interface IGoodModel
    extends Model<
        InferAttributes<IGoodModel>,
        InferCreationAttributes<IGoodModel>
    > {
    error?: boolean
    message?: string
    id: CreationOptional<number>
    title: string
    imageUrl: string
    description: string
    price: number
    seller_id: number
    available: number
    active: boolean
    addCategory: HasManyAddAssociationMixin<ICategoryModel, number>
    setCategories: HasManySetAssociationsMixin<ICategoryModel, number>
}

export type GoodType = typeof Model & {
    new (values?: object, options?: BuildOptions): IGoodModel
}

const GoodModel = (ctx: IContextContainer) => {
    const Good = <GoodType>ctx.db.define<IGoodModel>(
        'good',
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            title: { type: DataTypes.STRING, allowNull: false },
            imageUrl: DataTypes.STRING,
            description: DataTypes.TEXT,
            price: { type: DataTypes.FLOAT, allowNull: false },
            seller_id: { type: DataTypes.INTEGER, allowNull: false },
            available: { type: DataTypes.INTEGER, allowNull: false },
            active: { type: DataTypes.TINYINT, allowNull: false },
        },
        {}
    )

    ctx.User.hasMany(Good, { foreignKey: 'seller_id', as: 'goods' })
    Good.belongsTo(ctx.User, { foreignKey: 'seller_id', as: 'seller' })
    return Good
}

export default GoodModel

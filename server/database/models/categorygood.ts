import { BuildOptions, Model, DataTypes } from 'sequelize'
import { IContextContainer } from '../../container'
import { InferAttributes, InferCreationAttributes } from 'sequelize'

export interface ICategoryGoodModel
    extends Model<
        InferAttributes<ICategoryGoodModel>,
        InferCreationAttributes<ICategoryGoodModel>
    > {}

export type CategoryGoodType = typeof Model & {
    new (values?: object, options?: BuildOptions): ICategoryGoodModel
}

const CategoryGoodModel = (ctx: IContextContainer) => {
    const CategoryGood = <CategoryGoodType>ctx.db.define<ICategoryGoodModel>(
        'CategoryGood',
        {},
        {
            tableName: 'category_good',
            timestamps: false,
        }
    )
    return CategoryGood
}

export default CategoryGoodModel

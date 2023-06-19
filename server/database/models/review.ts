import { BuildOptions, Model, DataTypes, CreationOptional } from "sequelize";
import { InferAttributes, InferCreationAttributes } from "sequelize";

import { IContextContainer } from '../../container';


export interface IReviewModel extends Model<InferAttributes<IReviewModel>, InferCreationAttributes<IReviewModel>> {
  id: CreationOptional<number>;
  goodId: number,
  text: string,
  score: number,
  authorId: number,
  datepub: Date
}


export type ReviewType = typeof Model & {
  new(values?: object, options?: BuildOptions): IReviewModel
}


const ReviewModel = (ctx: IContextContainer) => {
  const Review = <ReviewType>ctx.db.define<IReviewModel>('review', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    goodId: DataTypes.INTEGER,
    text: DataTypes.TEXT,
    score: DataTypes.FLOAT,
    authorId: DataTypes.INTEGER,
    datepub: DataTypes.DATE,
  }, 
  { timestamps: false }
  );


  ctx.User.hasMany(Review, { foreignKey: 'authorId', as: 'reviews' });
  Review.belongsTo(ctx.User, { foreignKey: 'authorId', as: 'author' });

  ctx.Good.hasMany(Review, { foreignKey: 'goodId', as: 'reviews' });
  Review.belongsTo(ctx.Good, { foreignKey: 'goodId', as: 'good' });
  return Review
}

export default ReviewModel


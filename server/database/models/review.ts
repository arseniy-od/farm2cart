import { BuildOptions, Model, DataTypes } from "sequelize";
import { InferAttributes, InferCreationAttributes } from "sequelize";

import { IContextContainer } from '../../container';


export interface IReviewModel extends Model<InferAttributes<IReviewModel>, InferCreationAttributes<IReviewModel>> {
  goodId: number,
  text: string,
  score: number,
  authorId: number
}


export type ReviewType = typeof Model & {
  new(values?: object, options?: BuildOptions): IReviewModel
}


const ReviewModel = (ctx: IContextContainer) => {
  const Review = <ReviewType>ctx.db.define<IReviewModel>('review', {
    goodId: DataTypes.INTEGER,
    text: DataTypes.TEXT,
    score: DataTypes.FLOAT,
    authorId: DataTypes.INTEGER
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


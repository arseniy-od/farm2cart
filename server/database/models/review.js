import { Model, DataTypes } from "sequelize";


const ReviewModel = (ctx) => {
  const Review = ctx.db.define('review', {
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true, // add this option to indicate that id is the primary key
    //   autoIncrement: true,
    //   allowNull: false,
    // },
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











// import {Model, DataTypes} from "sequelize";
// import sequelize from './connection'


// export default class Review extends Model {}
// Review.init({
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true, // add this option to indicate that id is the primary key
//     autoIncrement: true,
//     allowNull: false,
//   },
//   goodId: DataTypes.INTEGER,
//   text: DataTypes.TEXT,
//   score: DataTypes.FLOAT,
//   authorId: DataTypes.INTEGER
// }, {
//   sequelize,
//   modelName: 'review',
//   timestamps: false,
// });

import {Model, DataTypes} from "sequelize";
import sequelize from './connection'


export default class Review extends Model {}
Review.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // add this option to indicate that id is the primary key
    autoIncrement: true,
    allowNull: false,
  },
  goodId: DataTypes.INTEGER,
  text: DataTypes.TEXT,
  score: DataTypes.FLOAT,
  authorId: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'review',
  timestamps: false,
});


//! Sage
// const Review = sequelize.define('review', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true, // add this option to indicate that id is the primary key
//     autoIncrement: true,
//     allowNull: false,
//   },
//   score: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   // other attributes...
// });

import User from './user'
import Good from './good'


User.hasMany(Good, {
  foreignKey: 'seller_id',
  as: 'goods',
});

Good.belongsTo(User, {
  foreignKey: 'seller_id',
  as: 'seller',
});


export {User, Good};

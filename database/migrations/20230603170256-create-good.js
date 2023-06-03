/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('goods', {
      id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
      title: {type: Sequelize.STRING, allowNull: false},
      imageUrl: {type: Sequelize.STRING},
      description: {type: Sequelize.TEXT},
      price: {type: Sequelize.FLOAT, allowNull: false},
      seller_id: {type: Sequelize.INTEGER, allowNull:false},
      createdAt: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
      updatedAt: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')}
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('goods');
  }
};
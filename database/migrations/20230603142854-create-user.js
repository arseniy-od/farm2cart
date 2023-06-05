/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
      firstName: {type: Sequelize.STRING},
      lastName: {type: Sequelize.STRING},
      username: {type: Sequelize.STRING},
      password: {type: Sequelize.STRING},
      email: {type: Sequelize.STRING, unique: true, allowNull:false},
      phoneNumber: {type: Sequelize.STRING},
      role: {type: Sequelize.STRING, defaultValue: 'customer'},
      companyId: {type: Sequelize.INTEGER, defaultValue: null},
      createdAt: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),},
      updatedAt: {allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),}
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('users');
  }
};
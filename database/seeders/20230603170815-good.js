'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('goods', [{
      title: "Strawberries",
      imageUrl: "https://images.unsplash.com/photo-1587393855524-087f83d95bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=760&q=80",
      description: "Ripe sweet and beautiful strawberries",
      price: 85.5,
      seller_id: 1
    }]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('goods', null, {});
  }
};

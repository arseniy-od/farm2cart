'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const categoryItems = [
      {categoryId: 1, goodId: 1},
      {categoryId: 2, goodId: 1},
      {categoryId: 3, goodId: 1},

    ];

    const categories = [
      {text: "Sale"},
      {text: "Organic"},
      {text: "Berry"},

    ];
    await queryInterface.bulkInsert('categories', categories);
    await queryInterface.bulkInsert('categoryGoods', categoryItems);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
    await queryInterface.bulkDelete('categoryGoods', null, {});
  }
};

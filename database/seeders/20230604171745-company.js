'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('companies', [
      {
        name: "Horns and hooves Inc.",
        description: "Best products in THE WORLD",
        address: "Schevchenko st.1",
        email: "dontwriteus@hornsandhooves.inc",
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('companies', null, {})
  }
};

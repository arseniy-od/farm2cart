'use strict';

/** @type {import('sequelize-cli').Migration} */


module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        password: '12345', // password
        email: 'example1@example.com',
        role: 'seller',
        phoneNumber: '0239239249239',
        companyId: 1
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
        username: 'janedoe',
        password: '12345', // password
        email: 'example2@example.com',
        phoneNumber: '0239239249238',
      },
      {
        firstName: 'Tom',
        lastName: 'Cruise',
        username: 'superspy',
        password: '12345', // password
        email: 'example3@example.com',
        phoneNumber: '0239239249237',
      }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};

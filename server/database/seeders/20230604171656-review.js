'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('reviews', [
            {
                goodId: 1,
                text: 'Very good',
                score: 5.0,
                authorId: 1,
            },
            {
                goodId: 1,
                text: 'Very average',
                score: 3.0,
                authorId: 2,
            },
            {
                goodId: 1,
                text: 'Very bad',
                score: 1.0,
                authorId: 3,
            },
        ])
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('reviews', null, {})
    },
}

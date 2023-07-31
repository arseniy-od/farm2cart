'use strict'

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('companies', [
            {
                name: 'Horns and hooves Inc.',
                description: 'Best products in THE WORLD',
                address: 'Schevchenko st.1',
                email: 'dontwriteus@hornsandhooves.inc',
            },
        ])

        await queryInterface.bulkInsert('users', [
            {
                firstName: 'John',
                lastName: 'Doe',
                username: 'johndoe',
                password: '12345', // password
                email: 'example1@example.com',
                role: 'seller',
                phoneNumber: '0239239249239',
                companyId: 1,
            },
            {
                firstName: 'Jane',
                lastName: 'Doe',
                username: 'janedoe',
                password: '12345', // password
                email: 'example2@example.com',
                role: 'customer',
                phoneNumber: '0239239249238',
            },
            {
                firstName: 'Tom',
                lastName: 'Cruise',
                username: 'superspy',
                password: '12345', // password
                email: 'example3@example.com',
                role: 'customer',
                phoneNumber: '0239239249237',
            },
        ])

        const orderItems = [
            { orderId: 1, goodId: 1, quantity: 2 },
            { orderId: 1, goodId: 2, quantity: 1 },
            { orderId: 1, goodId: 3, quantity: 3 },
        ]

        const goods = [
            {
                title: 'Strawberries',
                imageUrl:
                    'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=760&q=80',
                description: 'Ripe sweet and beautiful strawberries',
                price: 85.5,
                seller_id: 1,
                available: 50,
            },
            {
                title: 'Bananas',
                imageUrl:
                    'https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=627&q=80',
                description: 'Ripe sweet and beautiful bananas',
                price: 70.0,
                seller_id: 1,
                available: 70,
            },
            {
                title: 'Cranberries',
                imageUrl:
                    'https://lastfm.freetls.fastly.net/i/u/ar0/ac64731e87dcde6d8b27ffb837b2d119.jpg',
                description: 'Ripe sweet and beautiful cranberries',
                price: 100500.0,
                seller_id: 1,
                available: 10,
            },
        ]
        const orders = [
            {
                customerId: 2,
                total: 301741.0,
                paymentStatus: 'Ok',
            },
        ]
        await queryInterface.bulkInsert('goods', goods)
        await queryInterface.bulkInsert('orders', orders)
        await queryInterface.bulkInsert('order_goods', orderItems)
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('users', null, {})
        await queryInterface.bulkDelete('companies', null, {})
        await queryInterface.bulkDelete('goods', null, {})
        await queryInterface.bulkDelete('orders', null, {})
        await queryInterface.bulkDelete('order_goods', null, {})
    },
}

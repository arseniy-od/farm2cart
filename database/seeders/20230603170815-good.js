module.exports = {
  async up(queryInterface, Sequelize) {
    const orderItems = [
      {
        orderId: 1,
        goodId: 1,
        quantity: 2,
      },
      {
        orderId: 1,
        goodId: 2,
        quantity: 1,
      },
      {
        orderId: 1,
        goodId: 1,
        quantity: 3,
      },
    ];
    const goods = [
      {
        title: 'Strawberries',
        imageUrl: 'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=760&q=80',
        description: 'Ripe sweet and beautiful strawberries',
        price: 85.5,
        seller_id: 1,
      },
      {
        title: 'Bananas',
        imageUrl: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=627&q=80',
        description: 'Ripe sweet and beautiful bananas',
        price: 70.0,
        seller_id: 1,
      },
      {
        title: 'Cranberries',
        imageUrl: 'https://lastfm.freetls.fastly.net/i/u/ar0/ac64731e87dcde6d8b27ffb837b2d119.jpg',
        description: 'Ripe sweet and beautiful cranberries',
        price: 100500.0,
        seller_id: 1,
      },
    ];
    const orders = [
      {
        customerId: 2,
        total: 85.5,
        paymentStatus: 'Ok',
      },
    ];
    await queryInterface.bulkInsert('goods', goods);
    await queryInterface.bulkInsert('orders', orders);
    await queryInterface.bulkInsert('orderGoods', orderItems);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('goods', null, {});
    await queryInterface.bulkDelete('orders', null, {});
    await queryInterface.bulkDelete('orderGoods', null, {});
  },
};
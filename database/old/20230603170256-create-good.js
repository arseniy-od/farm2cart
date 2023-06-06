/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    query(' CREATE TABLE `petition` (\n' +
        '  `id` bigint unsigned NOT NULL AUTO_INCREMENT,\n' +
        '  `name` varchar(127) DEFAULT NULL,\n' +
        '  `user_id` bigint unsigned DEFAULT NULL,\n' +
        '  `description` text,\n' +
        '  `answer` text,\n' +
        '  `status` varchar(45) DEFAULT NULL,\n' +
        '  `created_at` bigint DEFAULT NULL,\n' +
        '  `updated_at` bigint DEFAULT NULL,\n' +
        '  `deleted_at` bigint DEFAULT NULL,\n' +
        '  `is_deleted` tinyint DEFAULT NULL,\n' +
        '  PRIMARY KEY (`id`),\n' +
        '  KEY `is_deleted` (`id`),\n' +
        '  KEY `name` (`name`),\n' +
        '  KEY `user_id` (`user_id`),\n' +
        '  KEY `status` (`status`),\n' +
        '  FULLTEXT KEY `details` (`description`,`answer`),\n' +
        '  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE\n' +
        ') ENGINE=InnoDB AUTO_INCREMENT=2136 DEFAULT CHARSET=utf8mb3;')
  },
  async down(queryInterface) {
    await queryInterface.dropTable('goods');
  }
};
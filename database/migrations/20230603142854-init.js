


/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

        await queryInterface.sequelize.query(
            "CREATE TABLE IF NOT EXISTS `farm2cart`.`companies` (\n" +
            "  `id` INT NOT NULL AUTO_INCREMENT,\n" +
            "  `name` VARCHAR(45) NULL,\n" +
            "  `description` TEXT NULL,\n" +
            "  `address` VARCHAR(255) NULL,\n" +
            "  `email` VARCHAR(100) NULL,\n" +
            "  `registrationDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,\n" +
            "  PRIMARY KEY (`id`))\n" +
            "ENGINE = InnoDB"
        );

        await queryInterface.sequelize.query(
            "CREATE TABLE IF NOT EXISTS `farm2cart`.`users` (\n" +
            "  `id` INT NOT NULL AUTO_INCREMENT,\n" +
            "  `firstName` VARCHAR(45) NULL,\n" +
            "  `lastName` VARCHAR(45) NULL,\n" +
            "  `username` VARCHAR(100) NOT NULL,\n" +
            "  `email` VARCHAR(100) NOT NULL,\n" +
            "  `password` VARCHAR(255) NOT NULL,\n" +
            "  `role` VARCHAR(100) NOT NULL DEFAULT 'customer',\n" +
            "  `companyId` INT NULL DEFAULT NULL,\n" +
            "  `phoneNumber` VARCHAR(45) NULL,\n" +
            "  `registrationDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,\n" +
            "  PRIMARY KEY (`id`),\n" +
            "  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,\n" +
            "  INDEX `fk_users_2_idx` (`companyId` ASC) VISIBLE,\n" +
            "  CONSTRAINT `fk_users_2`\n" +
            "    FOREIGN KEY (`companyId`)\n" +
            "    REFERENCES `farm2cart`.`companies` (`id`)\n" +
            "    ON DELETE SET NULL\n" +
            "    ON UPDATE CASCADE)\n" +
            "ENGINE = InnoDB"
        );
        await queryInterface.sequelize.query(
            "CREATE TABLE IF NOT EXISTS `farm2cart`.`goods` (\n" +
            "  `id` INT NOT NULL AUTO_INCREMENT,\n" +
            "  `title` VARCHAR(100) NULL,\n" +
            "  `imageUrl` VARCHAR(255) NULL,\n" +
            "  `description` TEXT NULL,\n" +
            "  `price` FLOAT NOT NULL,\n" +
            "  `datepub` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,\n" +
            "  `seller_id` INT NOT NULL,\n" +
            "  PRIMARY KEY (`id`),\n" +
            "  INDEX `seller_id_idx` (`seller_id` ASC) VISIBLE,\n" +
            "  CONSTRAINT `seller_id`\n" +
            "    FOREIGN KEY (`seller_id`)\n" +
            "    REFERENCES `farm2cart`.`users` (`id`)\n" +
            "    ON DELETE NO ACTION\n" +
            "    ON UPDATE NO ACTION)\n" +
            "ENGINE = InnoDB"
        );

        await queryInterface.sequelize.query(
            "CREATE TABLE IF NOT EXISTS `farm2cart`.`reviews` (\n" +
            "  `id` INT NOT NULL AUTO_INCREMENT,\n" +
            "  `goodId` INT NOT NULL,\n" +
            "  `text` TEXT NULL,\n" +
            "  `score` FLOAT NULL,\n" +
            "  `authorId` INT NULL,\n" +
            "  `datepub` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,\n" +
            "  PRIMARY KEY (`id`),\n" +
            "  INDEX `fk_reviews_1_idx` (`goodId` ASC) VISIBLE,\n" +
            "  INDEX `fk_reviews_2_idx` (`authorId` ASC) VISIBLE,\n" +
            "  CONSTRAINT `fk_reviews_1`\n" +
            "    FOREIGN KEY (`goodId`)\n" +
            "    REFERENCES `farm2cart`.`goods` (`id`)\n" +
            "    ON DELETE CASCADE\n" +
            "    ON UPDATE CASCADE,\n" +
            "  CONSTRAINT `fk_reviews_2`\n" +
            "    FOREIGN KEY (`authorId`)\n" +
            "    REFERENCES `farm2cart`.`users` (`id`)\n" +
            "    ON DELETE NO ACTION\n" +
            "    ON UPDATE NO ACTION)\n" +
            "ENGINE = InnoDB"
        );

        await queryInterface.sequelize.query(
            "CREATE TABLE IF NOT EXISTS `farm2cart`.`categories` (\n" +
            "  `id` INT NOT NULL AUTO_INCREMENT,\n" +
            "  `text` VARCHAR(150) NULL,\n" +
            "  PRIMARY KEY (`id`))\n" +
            "ENGINE = InnoDB"
        );

        await queryInterface.sequelize.query(
            "CREATE TABLE IF NOT EXISTS `farm2cart`.`category_good` (\n" +
            "  `id` INT NOT NULL AUTO_INCREMENT,\n" +
            "  `categoryId` INT NULL,\n" +
            "  `goodId` INT NOT NULL,\n" +
            "  PRIMARY KEY (`id`),\n" +
            "  INDEX `fk_category_good_1_idx` (`categoryId` ASC) VISIBLE,\n" +
            "  INDEX `fk_category_good_2_idx` (`goodId` ASC) VISIBLE,\n" +
            "  CONSTRAINT `fk_category_good_1`\n" +
            "    FOREIGN KEY (`categoryId`)\n" +
            "    REFERENCES `farm2cart`.`categories` (`id`)\n" +
            "    ON DELETE CASCADE\n" +
            "    ON UPDATE CASCADE,\n" +
            "  CONSTRAINT `fk_category_good_2`\n" +
            "    FOREIGN KEY (`goodId`)\n" +
            "    REFERENCES `farm2cart`.`goods` (`id`)\n" +
            "    ON DELETE CASCADE\n" +
            "    ON UPDATE CASCADE)\n" +
            "ENGINE = InnoDB"
        );

        await queryInterface.sequelize.query(
            "CREATE TABLE IF NOT EXISTS `farm2cart`.`orders` (\n" +
            "  `id` INT NOT NULL AUTO_INCREMENT,\n" +
            "  `customerId` INT NULL,\n" +
            "  `total` FLOAT NULL,\n" +
            "  `paymentStatus` VARCHAR(45) NULL,\n" +
            "  `date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,\n" +
            "  PRIMARY KEY (`id`),\n" +
            "  INDEX `fk_table1_1_idx` (`customerId` ASC) VISIBLE,\n" +
            "  CONSTRAINT `fk_table1_1`\n" +
            "    FOREIGN KEY (`customerId`)\n" +
            "    REFERENCES `farm2cart`.`users` (`id`)\n" +
            "    ON DELETE NO ACTION\n" +
            "    ON UPDATE CASCADE)\n" +
            "ENGINE = InnoDB"
        );

        await queryInterface.sequelize.query(
            "CREATE TABLE IF NOT EXISTS `farm2cart`.`order_goods` (\n" +
            "  `id` INT NOT NULL AUTO_INCREMENT,\n" +
            "  `orderId` INT NOT NULL,\n" +
            "  `goodId` INT NOT NULL,\n" +
            "  `quantity` INT NOT NULL DEFAULT 1,\n" +
            "  PRIMARY KEY (`id`),\n" +
            "  INDEX `fk_order_goods_1_idx` (`orderId` ASC) VISIBLE,\n" +
            "  INDEX `fk_order_goods_2_idx` (`goodId` ASC) VISIBLE,\n" +
            "  CONSTRAINT `fk_order_goods_1`\n" +
            "    FOREIGN KEY (`orderId`)\n" +
            "    REFERENCES `farm2cart`.`orders` (`id`)\n" +
            "    ON DELETE NO ACTION\n" +
            "    ON UPDATE NO ACTION,\n" +
            "  CONSTRAINT `fk_order_goods_2`\n" +
            "    FOREIGN KEY (`goodId`)\n" +
            "    REFERENCES `farm2cart`.`goods` (`id`)\n" +
            "    ON DELETE NO ACTION\n" +
            "    ON UPDATE NO ACTION)\n" +
            "ENGINE = InnoDB"
        );
    },
    async down(queryInterface) {
        await queryInterface.dropTable('users');
    }
};

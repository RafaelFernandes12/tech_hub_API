-- CreateTable
CREATE TABLE `product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `qtd` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `category` ENUM('ELECTRONICS', 'FURNITURE', 'CLOTHING', 'FOOD', 'BEAUTY', 'TOYS', 'SPORTS', 'AUTOMOTIVE', 'BOOKS', 'MUSIC') NOT NULL,
    `manufacturer` ENUM('SONY', 'SAMSUNG', 'APPLE', 'LG', 'NIKE', 'ADIDAS', 'TOYOTA', 'HONDA', 'PUMA', 'LOREAL') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sells` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `qtd` INTEGER NOT NULL,
    `totalValue` DOUBLE NOT NULL,
    `productId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sells` ADD CONSTRAINT `sells_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

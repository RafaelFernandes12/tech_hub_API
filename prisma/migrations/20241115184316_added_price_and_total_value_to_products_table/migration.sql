/*
  Warnings:

  - Added the required column `price` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalValue` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `price` DOUBLE NOT NULL,
    ADD COLUMN `totalValue` DOUBLE NOT NULL;

/*
  Warnings:

  - You are about to drop the column `price` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `profit` on the `sells` table. All the data in the column will be lost.
  - Added the required column `price` to the `sells` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `price`;

-- AlterTable
ALTER TABLE `sells` DROP COLUMN `profit`,
    ADD COLUMN `price` DOUBLE NOT NULL;

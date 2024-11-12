/*
  Warnings:

  - Added the required column `profit` to the `sells` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sells` ADD COLUMN `profit` DOUBLE NOT NULL;

/*
  Warnings:

  - You are about to drop the `_SujetCategories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_SujetCategories` DROP FOREIGN KEY `_SujetCategories_A_fkey`;

-- DropForeignKey
ALTER TABLE `_SujetCategories` DROP FOREIGN KEY `_SujetCategories_B_fkey`;

-- DropTable
DROP TABLE `_SujetCategories`;

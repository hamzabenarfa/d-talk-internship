/*
  Warnings:

  - You are about to drop the `sujetCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `sujet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `sujetCategory` DROP FOREIGN KEY `sujetCategory_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `sujetCategory` DROP FOREIGN KEY `sujetCategory_sujetId_fkey`;

-- AlterTable
ALTER TABLE `sujet` ADD COLUMN `categoryId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `sujetCategory`;

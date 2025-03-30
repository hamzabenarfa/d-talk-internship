/*
  Warnings:

  - The values [ADMIN] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `category` on the `sujet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('CANDIDAT', 'RESPONSABLE', 'PROF_SUPERVISOR') NOT NULL DEFAULT 'CANDIDAT';

-- AlterTable
ALTER TABLE `sujet` DROP COLUMN `category`;

-- CreateTable
CREATE TABLE `sujetCategory` (
    `sujetId` INTEGER NOT NULL,
    `categoryId` INTEGER NOT NULL,

    PRIMARY KEY (`sujetId`, `categoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SujetCategories` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_SujetCategories_AB_unique`(`A`, `B`),
    INDEX `_SujetCategories_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sujetCategory` ADD CONSTRAINT `sujetCategory_sujetId_fkey` FOREIGN KEY (`sujetId`) REFERENCES `sujet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sujetCategory` ADD CONSTRAINT `sujetCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SujetCategories` ADD CONSTRAINT `_SujetCategories_A_fkey` FOREIGN KEY (`A`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SujetCategories` ADD CONSTRAINT `_SujetCategories_B_fkey` FOREIGN KEY (`B`) REFERENCES `sujet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

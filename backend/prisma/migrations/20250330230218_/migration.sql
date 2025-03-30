-- CreateTable
CREATE TABLE `_SujetCategories` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_SujetCategories_AB_unique`(`A`, `B`),
    INDEX `_SujetCategories_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_SujetCategories` ADD CONSTRAINT `_SujetCategories_A_fkey` FOREIGN KEY (`A`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SujetCategories` ADD CONSTRAINT `_SujetCategories_B_fkey` FOREIGN KEY (`B`) REFERENCES `sujet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

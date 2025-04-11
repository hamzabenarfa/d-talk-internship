-- AddForeignKey
ALTER TABLE `Commentaire` ADD CONSTRAINT `Commentaire_auteurID_fkey` FOREIGN KEY (`auteurID`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

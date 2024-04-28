-- AlterTable
ALTER TABLE `farms` ADD COLUMN `cooperat` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `farms` ADD CONSTRAINT `farms_cooperat_fkey` FOREIGN KEY (`cooperat`) REFERENCES `cooperate_account`(`cooperate_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

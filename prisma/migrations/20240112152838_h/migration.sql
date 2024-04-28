-- AlterTable
ALTER TABLE `farmers_data` ADD COLUMN `dashId` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `farmers_data` ADD CONSTRAINT `farmers_data_dashId_fkey` FOREIGN KEY (`dashId`) REFERENCES `admins`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

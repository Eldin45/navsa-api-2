-- AlterTable
ALTER TABLE `input_supplier` ADD COLUMN `dashID` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `input_supplier` ADD CONSTRAINT `input_supplier_dashID_fkey` FOREIGN KEY (`dashID`) REFERENCES `admins`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

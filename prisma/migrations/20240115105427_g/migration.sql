-- AlterTable
ALTER TABLE `eopInput_request` ADD COLUMN `supplier` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `eopInput_request` ADD CONSTRAINT `eopInput_request_supplier_fkey` FOREIGN KEY (`supplier`) REFERENCES `input_supplier`(`supplier_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

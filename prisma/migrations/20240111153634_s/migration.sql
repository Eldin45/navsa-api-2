-- CreateTable
CREATE TABLE `supplier_settings` (
    `ivinputs_id` INTEGER NOT NULL AUTO_INCREMENT,
    `supplierId` INTEGER NOT NULL,
    `transactionPin` VARCHAR(191) NOT NULL,
    `otpCode` VARCHAR(191) NOT NULL DEFAULT '0000',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`ivinputs_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `supplier_settings` ADD CONSTRAINT `supplier_settings_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `input_supplier`(`supplier_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

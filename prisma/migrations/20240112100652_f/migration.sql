-- CreateTable
CREATE TABLE `reports` (
    `report_id` INTEGER NOT NULL AUTO_INCREMENT,
    `farmId` INTEGER NOT NULL,
    `report_data` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`report_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_farmId_fkey` FOREIGN KEY (`farmId`) REFERENCES `farms`(`farm_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

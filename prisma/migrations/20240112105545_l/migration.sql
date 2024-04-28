/*
  Warnings:

  - You are about to drop the column `ivinputId` on the `allocated_inputs` table. All the data in the column will be lost.
  - You are about to drop the `_farmsToiv_inputs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `iv_inputs` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `inputId` to the `allocated_inputs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_farmsToiv_inputs` DROP FOREIGN KEY `_farmsToiv_inputs_A_fkey`;

-- DropForeignKey
ALTER TABLE `_farmsToiv_inputs` DROP FOREIGN KEY `_farmsToiv_inputs_B_fkey`;

-- DropForeignKey
ALTER TABLE `allocated_inputs` DROP FOREIGN KEY `allocated_inputs_ivinputId_fkey`;

-- AlterTable
ALTER TABLE `allocated_inputs` DROP COLUMN `ivinputId`,
    ADD COLUMN `inputId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_farmsToiv_inputs`;

-- DropTable
DROP TABLE `iv_inputs`;

-- CreateTable
CREATE TABLE `farm_store` (
    `allocatedd_id` INTEGER NOT NULL AUTO_INCREMENT,
    `farmID` INTEGER NOT NULL,
    `inputId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unit` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`allocatedd_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `allocated_inputs` ADD CONSTRAINT `allocated_inputs_inputId_fkey` FOREIGN KEY (`inputId`) REFERENCES `agro_inputs`(`input_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `farm_store` ADD CONSTRAINT `farm_store_farmID_fkey` FOREIGN KEY (`farmID`) REFERENCES `farms`(`farm_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `farm_store` ADD CONSTRAINT `farm_store_inputId_fkey` FOREIGN KEY (`inputId`) REFERENCES `agro_inputs`(`input_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

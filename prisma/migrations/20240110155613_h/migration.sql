/*
  Warnings:

  - You are about to drop the column `previllage` on the `input_supplier` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `input_supplier` DROP COLUMN `previllage`,
    MODIFY `recover_pin` VARCHAR(191) NULL,
    MODIFY `approve_status` INTEGER NULL;

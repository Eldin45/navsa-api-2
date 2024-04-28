/*
  Warnings:

  - Added the required column `fromBankCode` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toBankCode` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `fromBankCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `toBankCode` VARCHAR(191) NOT NULL;

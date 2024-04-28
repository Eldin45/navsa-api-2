/*
  Warnings:

  - Added the required column `accountName` to the `admin_wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admin_wallet` ADD COLUMN `accountName` VARCHAR(191) NOT NULL;

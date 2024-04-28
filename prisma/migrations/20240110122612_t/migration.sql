/*
  Warnings:

  - Added the required column `Account_name` to the `farmers_wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `farmers_wallet` ADD COLUMN `Account_name` VARCHAR(191) NOT NULL;

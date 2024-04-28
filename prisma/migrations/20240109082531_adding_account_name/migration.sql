/*
  Warnings:

  - Added the required column `account_name` to the `cooperate_wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cooperate_wallet` ADD COLUMN `account_name` VARCHAR(191) NOT NULL;

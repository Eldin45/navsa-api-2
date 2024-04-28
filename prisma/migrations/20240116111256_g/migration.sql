/*
  Warnings:

  - Added the required column `response_code` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `response_code` VARCHAR(191) NOT NULL;

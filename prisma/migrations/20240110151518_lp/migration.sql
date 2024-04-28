/*
  Warnings:

  - Added the required column `size` to the `farms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `farms` ADD COLUMN `size` DECIMAL(65, 30) NOT NULL;

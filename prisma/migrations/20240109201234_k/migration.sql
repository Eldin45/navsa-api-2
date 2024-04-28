/*
  Warnings:

  - You are about to drop the column `localId` on the `farmers_data` table. All the data in the column will be lost.
  - You are about to drop the `localGvt` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `farmers_data` DROP FOREIGN KEY `farmers_data_localId_fkey`;

-- AlterTable
ALTER TABLE `farmers_data` DROP COLUMN `localId`;

-- DropTable
DROP TABLE `localGvt`;

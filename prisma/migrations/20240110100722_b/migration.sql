/*
  Warnings:

  - You are about to drop the column `description` on the `states` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `states_description_key` ON `states`;

-- AlterTable
ALTER TABLE `states` DROP COLUMN `description`;

/*
  Warnings:

  - You are about to drop the column `state` on the `states` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[state_name]` on the table `states` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `state_name` to the `states` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `states_state_key` ON `states`;

-- AlterTable
ALTER TABLE `states` DROP COLUMN `state`,
    ADD COLUMN `state_name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `states_state_name_key` ON `states`(`state_name`);

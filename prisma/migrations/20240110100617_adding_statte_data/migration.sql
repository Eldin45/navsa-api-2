/*
  Warnings:

  - A unique constraint covering the columns `[state_map]` on the table `states` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[state_logo]` on the table `states` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `state_logo` to the `states` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state_map` to the `states` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `states` ADD COLUMN `state_logo` VARCHAR(191) NOT NULL,
    ADD COLUMN `state_map` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `states_state_map_key` ON `states`(`state_map`);

-- CreateIndex
CREATE UNIQUE INDEX `states_state_logo_key` ON `states`(`state_logo`);

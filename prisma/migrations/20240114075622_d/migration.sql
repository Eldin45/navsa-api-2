/*
  Warnings:

  - You are about to drop the column `approve_state` on the `eopInput_request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `eopInput_request` DROP COLUMN `approve_state`,
    ADD COLUMN `approve_status` INTEGER NOT NULL DEFAULT 0;

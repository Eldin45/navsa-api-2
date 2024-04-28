/*
  Warnings:

  - A unique constraint covering the columns `[farm_name]` on the table `farms` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `farms_farm_name_key` ON `farms`(`farm_name`);

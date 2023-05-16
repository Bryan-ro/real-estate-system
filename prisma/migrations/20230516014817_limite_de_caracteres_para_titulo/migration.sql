/*
  Warnings:

  - You are about to alter the column `title` on the `immobiles` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE `immobiles` MODIFY `title` VARCHAR(50) NOT NULL;

/*
  Warnings:

  - The values [APARTAMENT] on the enum `immobiles_category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `immobiles` MODIFY `category` ENUM('HOUSE', 'APARTMENT', 'GROUND') NOT NULL;

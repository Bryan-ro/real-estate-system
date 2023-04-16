/*
  Warnings:

  - You are about to drop the `administrators` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `role` ENUM('MASTER', 'ADMIN', 'USER') NOT NULL;

-- DropTable
DROP TABLE `administrators`;

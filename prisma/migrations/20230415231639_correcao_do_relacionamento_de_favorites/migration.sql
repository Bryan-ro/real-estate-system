/*
  Warnings:

  - You are about to drop the column `userFavoriteId` on the `immobiles` table. All the data in the column will be lost.
  - The values [ADMIN] on the enum `users_role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `user_favorites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `immobiles` DROP FOREIGN KEY `immobiles_userFavoriteId_fkey`;

-- DropForeignKey
ALTER TABLE `user_favorites` DROP FOREIGN KEY `user_favorites_userId_fkey`;

-- AlterTable
ALTER TABLE `immobiles` DROP COLUMN `userFavoriteId`;

-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('MASTER', 'REALTOR', 'USER') NOT NULL;

-- DropTable
DROP TABLE `user_favorites`;

-- CreateTable
CREATE TABLE `UserFavorite` (
    `id` VARCHAR(191) NOT NULL,
    `immobileId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserFavorite` ADD CONSTRAINT `UserFavorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserFavorite` ADD CONSTRAINT `UserFavorite_immobileId_fkey` FOREIGN KEY (`immobileId`) REFERENCES `immobiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

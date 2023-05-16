/*
  Warnings:

  - You are about to drop the `adress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userfavorite` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `immobiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `immobiles` DROP FOREIGN KEY `immobiles_adressId_fkey`;

-- DropForeignKey
ALTER TABLE `userfavorite` DROP FOREIGN KEY `UserFavorite_immobileId_fkey`;

-- DropForeignKey
ALTER TABLE `userfavorite` DROP FOREIGN KEY `UserFavorite_userId_fkey`;

-- AlterTable
ALTER TABLE `immobiles` ADD COLUMN `title` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `adress`;

-- DropTable
DROP TABLE `userfavorite`;

-- CreateTable
CREATE TABLE `Address` (
    `id` VARCHAR(191) NOT NULL,
    `street` VARCHAR(191) NOT NULL,
    `number` INTEGER NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(8) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_favorites` (
    `id` VARCHAR(191) NOT NULL,
    `immobileId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `immobiles` ADD CONSTRAINT `immobiles_adressId_fkey` FOREIGN KEY (`adressId`) REFERENCES `Address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_favorites` ADD CONSTRAINT `user_favorites_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_favorites` ADD CONSTRAINT `user_favorites_immobileId_fkey` FOREIGN KEY (`immobileId`) REFERENCES `immobiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

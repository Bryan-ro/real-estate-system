-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(11) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_telephone_key`(`telephone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `imobiles` (
    `id` VARCHAR(191) NOT NULL,
    `contractType` ENUM('SALE', 'RENT') NOT NULL,
    `category` ENUM('HOUSE', 'APARTAMENT', 'GROUND') NOT NULL,
    `area` DOUBLE NOT NULL,
    `quantBedrooms` INTEGER NOT NULL,
    `bathrooms` INTEGER NOT NULL,
    `garage` BOOLEAN NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `adressId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `imobiles_adressId_key`(`adressId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Adress` (
    `id` VARCHAR(191) NOT NULL,
    `street` VARCHAR(191) NOT NULL,
    `number` INTEGER NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `imobiles` ADD CONSTRAINT `imobiles_adressId_fkey` FOREIGN KEY (`adressId`) REFERENCES `Adress`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

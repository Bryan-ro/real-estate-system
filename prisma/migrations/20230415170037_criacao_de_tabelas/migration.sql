-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(11) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('MASTER', 'ADMIN', 'USER') NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_telephone_key`(`telephone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `immobiles` (
    `id` VARCHAR(191) NOT NULL,
    `contractType` ENUM('SALE', 'RENT') NOT NULL,
    `category` ENUM('HOUSE', 'APARTAMENT', 'GROUND') NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `highlights` BOOLEAN NOT NULL DEFAULT false,
    `propertyId` VARCHAR(191) NOT NULL,
    `adressId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `immobiles_propertyId_key`(`propertyId`),
    UNIQUE INDEX `immobiles_adressId_key`(`adressId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImmobileProperty` (
    `id` VARCHAR(191) NOT NULL,
    `area` DOUBLE NOT NULL,
    `quantBedrooms` INTEGER NOT NULL DEFAULT 0,
    `quantBathrooms` INTEGER NOT NULL DEFAULT 0,
    `garage` BOOLEAN NOT NULL DEFAULT false,
    `description` LONGTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Adress` (
    `id` VARCHAR(191) NOT NULL,
    `street` VARCHAR(191) NOT NULL,
    `number` INTEGER NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(8) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `images` (
    `id` VARCHAR(191) NOT NULL,
    `image` BLOB NOT NULL,
    `immobileId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `immobiles` ADD CONSTRAINT `immobiles_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `ImmobileProperty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `immobiles` ADD CONSTRAINT `immobiles_adressId_fkey` FOREIGN KEY (`adressId`) REFERENCES `Adress`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `images` ADD CONSTRAINT `images_immobileId_fkey` FOREIGN KEY (`immobileId`) REFERENCES `immobiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

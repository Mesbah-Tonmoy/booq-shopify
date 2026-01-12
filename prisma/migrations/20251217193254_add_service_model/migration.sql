-- CreateTable
CREATE TABLE `Service` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NULL,
    `timezone` VARCHAR(191) NOT NULL DEFAULT 'Eastern time (ET)',
    `shopifyProductId` VARCHAR(191) NULL,
    `shopifyVariantIds` JSON NULL,
    `duration` INTEGER NOT NULL DEFAULT 60,
    `durationUnit` VARCHAR(191) NOT NULL DEFAULT 'Minutes',
    `bookingType` VARCHAR(191) NOT NULL DEFAULT 'general',
    `serviceType` VARCHAR(191) NOT NULL DEFAULT 'regular',
    `minDays` INTEGER NULL DEFAULT 1,
    `maxDays` INTEGER NULL DEFAULT 1,
    `multiDayBooking` VARCHAR(191) NULL DEFAULT 'flexible',
    `allowedDays` JSON NULL,
    `slotConfiguration` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `shopId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_shopId_fkey` FOREIGN KEY (`shopId`) REFERENCES `Shop`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

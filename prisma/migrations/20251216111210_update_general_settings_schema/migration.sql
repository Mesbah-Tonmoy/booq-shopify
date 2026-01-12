-- AlterTable
ALTER TABLE `shop` ADD COLUMN `additionalEmails` VARCHAR(191) NULL,
    ADD COLUMN `adminEmail` VARCHAR(191) NULL,
    ADD COLUMN `companyName` VARCHAR(191) NULL,
    ADD COLUMN `refundOnBookingCancel` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `GeneralSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `weekStartsOn` VARCHAR(191) NOT NULL DEFAULT 'Sunday',
    `timezone` VARCHAR(191) NOT NULL DEFAULT 'Asia/Dhaka',
    `dateFormat` VARCHAR(191) NOT NULL DEFAULT 'Default (Eg: Sun, 31 Dec 2023)',
    `timeFormat` VARCHAR(191) NOT NULL DEFAULT '12-hour format (Eg: 2 PM)',
    `cancellationPolicy` VARCHAR(191) NOT NULL DEFAULT 'Strict-48 hours notice',
    `slotReservationTime` VARCHAR(191) NOT NULL DEFAULT '5 min',
    `bookingRedirection` VARCHAR(191) NOT NULL DEFAULT 'Cart page',
    `paymentStatus` VARCHAR(191) NOT NULL DEFAULT 'Paid',
    `timezoneHandling` VARCHAR(191) NOT NULL DEFAULT 'Customer time zone',
    `universalBookingLink` BOOLEAN NOT NULL DEFAULT true,
    `automaticTimezoneDetection` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `shopId` INTEGER NOT NULL,

    UNIQUE INDEX `GeneralSettings_shopId_key`(`shopId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GeneralSettings` ADD CONSTRAINT `GeneralSettings_shopId_fkey` FOREIGN KEY (`shopId`) REFERENCES `Shop`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

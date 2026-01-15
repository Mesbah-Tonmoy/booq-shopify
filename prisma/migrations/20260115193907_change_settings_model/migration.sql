/*
  Warnings:

  - You are about to drop the `generalsettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `generalsettings` DROP FOREIGN KEY `GeneralSettings_shopId_fkey`;

-- DropTable
DROP TABLE `generalsettings`;

-- CreateTable
CREATE TABLE `Settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `weekStartsOn` VARCHAR(191) NOT NULL DEFAULT 'Sunday',
    `timezone` VARCHAR(191) NOT NULL DEFAULT 'Asia/Dhaka',
    `dateFormat` VARCHAR(191) NOT NULL DEFAULT 'Default (Eg: Sun, 31 Dec 2023)',
    `timeFormat` VARCHAR(191) NOT NULL DEFAULT '12-hour format (Eg: 2 PM)',
    `shopSetting` JSON NULL,
    `cancellationPolicy` VARCHAR(191) NOT NULL DEFAULT 'Strict-48 hours notice',
    `slotReservationTime` VARCHAR(191) NOT NULL DEFAULT '5 min',
    `bookingRedirection` VARCHAR(191) NOT NULL DEFAULT 'Cart page',
    `paymentStatus` VARCHAR(191) NOT NULL DEFAULT 'Paid',
    `universalBookingLink` BOOLEAN NOT NULL DEFAULT true,
    `widgetSettings` JSON NULL,
    `customerNotificationSettings` JSON NULL,
    `ownerNotificationSettings` JSON NULL,
    `emailTemplates` JSON NULL,
    `emailConfig` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `shopId` INTEGER NOT NULL,

    UNIQUE INDEX `Settings_shopId_key`(`shopId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Settings` ADD CONSTRAINT `Settings_shopId_fkey` FOREIGN KEY (`shopId`) REFERENCES `Shop`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

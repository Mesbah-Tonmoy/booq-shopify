/*
  Warnings:

  - You are about to drop the column `bookingType` on the `service` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `service` table. All the data in the column will be lost.
  - You are about to drop the column `durationUnit` on the `service` table. All the data in the column will be lost.
  - You are about to drop the column `slotConfiguration` on the `service` table. All the data in the column will be lost.
  - You are about to drop the column `additionalEmails` on the `shop` table. All the data in the column will be lost.
  - You are about to drop the column `adminEmail` on the `shop` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `shop` table. All the data in the column will be lost.
  - You are about to drop the column `refundOnBookingCancel` on the `shop` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `service` DROP COLUMN `bookingType`,
    DROP COLUMN `duration`,
    DROP COLUMN `durationUnit`,
    DROP COLUMN `slotConfiguration`,
    ADD COLUMN `allowReschedule` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `bundleBooking` JSON NULL,
    ADD COLUMN `cancelBooking` JSON NULL,
    ADD COLUMN `capacity` INTEGER NULL,
    ADD COLUMN `customerFields` JSON NULL,
    ADD COLUMN `hideLocationSelection` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `hideStaffSelection` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `locationType` JSON NULL,
    ADD COLUMN `maxProductQuantities` INTEGER NULL DEFAULT 5,
    ADD COLUMN `minimumAdvancedNotice` INTEGER NULL DEFAULT 0,
    ADD COLUMN `minimumAdvancedNoticeUnit` VARCHAR(191) NULL DEFAULT 'Hours',
    ADD COLUMN `notificationEmail` VARCHAR(191) NULL,
    ADD COLUMN `paymentPreferences` JSON NULL,
    ADD COLUMN `selectedLocations` JSON NULL,
    ADD COLUMN `selectedStaff` JSON NULL,
    ADD COLUMN `serviceVisibilityDays` INTEGER NULL DEFAULT 60,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE `shop` DROP COLUMN `additionalEmails`,
    DROP COLUMN `adminEmail`,
    DROP COLUMN `companyName`,
    DROP COLUMN `refundOnBookingCancel`;

-- CreateTable
CREATE TABLE `Slots` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serviceId` INTEGER NOT NULL,
    `slotConfiguration` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Slots` ADD CONSTRAINT `Slots_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - Made the column `phone` on table `staff` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `staff` MODIFY `phone` VARCHAR(191) NOT NULL;

/*
  Warnings:

  - You are about to drop the column `DeletedAt` on the `SavedPost` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `SavedPost` DROP COLUMN `DeletedAt`,
    ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Tag` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `status` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `UserDictionary` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `status` INTEGER NOT NULL DEFAULT 1;

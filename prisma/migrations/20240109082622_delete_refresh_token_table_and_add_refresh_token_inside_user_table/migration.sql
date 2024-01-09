/*
  Warnings:

  - You are about to drop the `RefreshToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `RefreshToken` DROP FOREIGN KEY `RefreshToken_author_id_fkey`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `refresh_token` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `RefreshToken`;

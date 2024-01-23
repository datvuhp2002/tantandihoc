/*
  Warnings:

  - You are about to drop the column `created_at` on the `UserDictionary` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `UserDictionary` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `UserProgress` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `UserProgress` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Vocabulary` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Vocabulary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `UserDictionary` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `UserProgress` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Vocabulary` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NULL;

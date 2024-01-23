/*
  Warnings:

  - You are about to drop the `vocabulary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `UserDictionary` DROP FOREIGN KEY `UserDictionary_vocabulary_id_fkey`;

-- DropForeignKey
ALTER TABLE `vocabulary` DROP FOREIGN KEY `vocabulary_category_id_fkey`;

-- DropTable
DROP TABLE `vocabulary`;

-- CreateTable
CREATE TABLE `Vocabulary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Vocabulary` ADD CONSTRAINT `Vocabulary_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserDictionary` ADD CONSTRAINT `UserDictionary_vocabulary_id_fkey` FOREIGN KEY (`vocabulary_id`) REFERENCES `Vocabulary`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

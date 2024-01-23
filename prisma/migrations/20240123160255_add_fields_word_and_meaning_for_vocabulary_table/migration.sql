/*
  Warnings:

  - Added the required column `lesson_id` to the `Vocabulary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meaning` to the `Vocabulary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `word` to the `Vocabulary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Vocabulary` ADD COLUMN `lesson_id` INTEGER NOT NULL,
    ADD COLUMN `meaning` VARCHAR(191) NOT NULL,
    ADD COLUMN `word` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Vocabulary` ADD CONSTRAINT `Vocabulary_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `Lesson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

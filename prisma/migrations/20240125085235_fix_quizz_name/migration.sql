/*
  Warnings:

  - You are about to drop the column `quizz_id` on the `UserProgress` table. All the data in the column will be lost.
  - Added the required column `quiz_id` to the `UserProgress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `UserProgress` DROP FOREIGN KEY `UserProgress_quizz_id_fkey`;

-- AlterTable
ALTER TABLE `UserProgress` DROP COLUMN `quizz_id`,
    ADD COLUMN `quiz_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `UserProgress` ADD CONSTRAINT `UserProgress_quiz_id_fkey` FOREIGN KEY (`quiz_id`) REFERENCES `Quiz`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

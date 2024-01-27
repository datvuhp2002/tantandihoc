-- DropForeignKey
ALTER TABLE `UserProgress` DROP FOREIGN KEY `UserProgress_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserProgress` DROP FOREIGN KEY `UserProgress_lesson_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserProgress` DROP FOREIGN KEY `UserProgress_quiz_id_fkey`;

-- AlterTable
ALTER TABLE `UserProgress` MODIFY `course_id` INTEGER NULL,
    MODIFY `lesson_id` INTEGER NULL,
    MODIFY `quiz_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `UserProgress` ADD CONSTRAINT `UserProgress_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `Course`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserProgress` ADD CONSTRAINT `UserProgress_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `Lesson`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserProgress` ADD CONSTRAINT `UserProgress_quiz_id_fkey` FOREIGN KEY (`quiz_id`) REFERENCES `Quiz`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

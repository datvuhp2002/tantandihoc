import { Test, TestingModule } from '@nestjs/testing';
import { CommentLessonController } from './comment-lesson.controller';

describe('CommentLessonController', () => {
  let controller: CommentLessonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentLessonController],
    }).compile();

    controller = module.get<CommentLessonController>(CommentLessonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

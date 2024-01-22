import { Test, TestingModule } from '@nestjs/testing';
import { CommentLessonService } from './comment-lesson.service';

describe('CommentLessonService', () => {
  let service: CommentLessonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentLessonService],
    }).compile();

    service = module.get<CommentLessonService>(CommentLessonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

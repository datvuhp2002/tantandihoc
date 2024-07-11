import { Test, TestingModule } from '@nestjs/testing';
import { QuizAnswerController } from './quiz-answer.controller';

describe('QuizAnswerController', () => {
  let controller: QuizAnswerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizAnswerController],
    }).compile();

    controller = module.get<QuizAnswerController>(QuizAnswerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

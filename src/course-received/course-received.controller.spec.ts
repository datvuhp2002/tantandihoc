import { Test, TestingModule } from '@nestjs/testing';
import { CourseReceivedController } from './course-received.controller';

describe('CourseReceivedController', () => {
  let controller: CourseReceivedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseReceivedController],
    }).compile();

    controller = module.get<CourseReceivedController>(CourseReceivedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

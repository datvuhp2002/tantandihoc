import { Test, TestingModule } from '@nestjs/testing';
import { CourseReceivedService } from './course-received.service';

describe('CourseReceivedService', () => {
  let service: CourseReceivedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseReceivedService],
    }).compile();

    service = module.get<CourseReceivedService>(CourseReceivedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

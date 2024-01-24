import { Test, TestingModule } from '@nestjs/testing';
import { UserDictionaryService } from './user-dictionary.service';

describe('UserDictionaryService', () => {
  let service: UserDictionaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserDictionaryService],
    }).compile();

    service = module.get<UserDictionaryService>(UserDictionaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

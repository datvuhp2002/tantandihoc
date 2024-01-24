import { Test, TestingModule } from '@nestjs/testing';
import { UserDictionaryController } from './user-dictionary.controller';

describe('UserDictionaryController', () => {
  let controller: UserDictionaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserDictionaryController],
    }).compile();

    controller = module.get<UserDictionaryController>(UserDictionaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

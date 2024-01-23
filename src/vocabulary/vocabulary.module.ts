import { Module } from '@nestjs/common';
import { VocabularyController } from './vocabulary.controller';
import { VocabularyService } from './vocabulary.service';
import { PrismaService } from 'src/prisma.servcie';

@Module({
  controllers: [VocabularyController],
  providers: [VocabularyService,PrismaService]
})
export class VocabularyModule {}

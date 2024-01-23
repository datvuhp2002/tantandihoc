import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { CreateVocabularyDto, UpdateVocabularyDto, VocabularyFilterType, VocabularyPaginationResponseType } from './dto/vocabulary.dto';
import { Vocabulary } from '@prisma/client';

@Controller('Vocabularies')
export class VocabularyController {
    constructor(private vocabularyService: VocabularyService){}
    @Post()
    create(@Body() data:CreateVocabularyDto):Promise<Vocabulary>{
        return this.vocabularyService.create(data)
    }
    @Get()
    getAll(@Query() filters:VocabularyFilterType):Promise<VocabularyPaginationResponseType>{
        return this.vocabularyService.getAll(filters)
    }
    @Get(":id")
    getDetail(@Param('id',ParseIntPipe) id: number):Promise<Vocabulary>{
        return this.vocabularyService.getDetail(id)
    }
    @Put(':id')
    update(@Param('id',ParseIntPipe) id: number,@Body() data: UpdateVocabularyDto){
        return this.vocabularyService.update(id,data)
    }
    @Delete(':id')
    delete(@Param('id') id: number){
        return this.vocabularyService.delete(id)
    }
}

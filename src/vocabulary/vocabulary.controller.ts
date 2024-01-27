import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { CreateVocabularyDto, UpdateVocabularyDto, VocabularyFilterType, VocabularyPaginationResponseType } from './dto/vocabulary.dto';
import { Vocabulary } from '@prisma/client';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('Vocabularies')
export class VocabularyController {
    constructor(private vocabularyService: VocabularyService){}
    @Post()
    @Roles('Admin','User')
    create(@Body() data:CreateVocabularyDto):Promise<Vocabulary>{
        return this.vocabularyService.create(data)
    }
    @Get()
    @Roles('Admin','User')
    getAll(@Query() filters:VocabularyFilterType):Promise<VocabularyPaginationResponseType>{
        return this.vocabularyService.getAll(filters)
    }
    @Get(":id")
    @Roles('Admin','User')
    getDetail(@Param('id',ParseIntPipe) id: number):Promise<Vocabulary>{
        return this.vocabularyService.getDetail(id)
    }
    @Put(':id')
    @Roles('Admin')
    update(@Param('id',ParseIntPipe) id: number,@Body() data: UpdateVocabularyDto){
        return this.vocabularyService.update(id,data)
    }
    @Delete(':id')
    @Roles('Admin')
    delete(@Param('id',ParseIntPipe) id: number){
        return this.vocabularyService.delete(id)
    }
}

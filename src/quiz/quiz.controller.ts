import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Quiz } from '@prisma/client';
import { CreateQuizDto, QuizFilterType, QuizPaginationResponseType, UpdateQuizDto } from './dto/quiz.dto';

@Controller('quiz')
export class QuizController {
    constructor(private quizService: QuizService){}
    @Get(':id')
    getDetail(@Param('id', ParseIntPipe) id: number):Promise<Quiz>{
        return this.quizService.getDetail(id);
    }
    @Get()
    getAll(@Query() filters:QuizFilterType):Promise<QuizPaginationResponseType>{
        return this.quizService.getAll(filters)
    }
    @Post()
    create(@Body() data: CreateQuizDto):Promise<Quiz>{
        return this.quizService.create(data)
    }
    @Put(':id')
    update(@Param('id',ParseIntPipe) id: number,@Body() data:UpdateQuizDto):Promise<Quiz>{
        return this.quizService.update(id,data)
    }
    @Delete(':id')
    delete(@Param('id',ParseIntPipe) id: number){
        return this.quizService.delete(id)
    }
}

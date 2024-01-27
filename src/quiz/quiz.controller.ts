import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Quiz } from '@prisma/client';
import { CreateQuizDto, QuizFilterType, QuizPaginationResponseType, UpdateQuizDto } from './dto/quiz.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('quiz')
export class QuizController {
    constructor(private quizService: QuizService){}
    @Get(':id')
    @Roles('Admin')
    getDetail(@Param('id', ParseIntPipe) id: number):Promise<Quiz>{
        return this.quizService.getDetail(id);
    }
    @Get()
    @Roles('Admin')
    getAll(@Query() filters:QuizFilterType):Promise<QuizPaginationResponseType>{
        return this.quizService.getAll(filters)
    }
    @Post()
    @Roles('Admin')
    create(@Body() data: CreateQuizDto):Promise<Quiz>{
        return this.quizService.create(data)
    }
    @Put(':id')
    @Roles('Admin')
    update(@Param('id',ParseIntPipe) id: number,@Body() data:UpdateQuizDto):Promise<Quiz>{
        return this.quizService.update(id,data)
    }
    @Delete(':id')
    @Roles('Admin')
    delete(@Param('id',ParseIntPipe) id: number){
        return this.quizService.delete(id)
    }
}

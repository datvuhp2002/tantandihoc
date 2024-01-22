import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Lesson } from '@prisma/client';
import { PrismaService } from 'src/prisma.servcie';
import { CreateLessonDto, LessonFilterType, LessonPaginationResponseType, UpdateLessonDto } from './dto/lesson.dto';

@Injectable()
export class LessonService {
    constructor(private prismaService:PrismaService){}
    async getAll(filters: LessonFilterType): Promise<LessonPaginationResponseType>{
        const items_per_page = Number(filters.items_per_page) || 10;
        const page = Number(filters.page) || 1
        const search = filters.search || ''
        const skip = page > 1 ? (page - 1) * items_per_page : 0
        const posts = await this.prismaService.lesson.findMany({
            take: items_per_page,
            skip,
            where: {
                OR: [
                    {
                        title:{
                            contains: search,
                        }
                    },
                    {
                        content:{
                            contains: search,
                        }
                    }
                ],
                AND: [
                    {
                        status: 1
                    }
                ],
                
            },
            include:{
                Quizze:{
                    select:{
                        answer: true
                    }
                },
                CommentLesson:{
                    select:{
                        author:true,
                        message:true,
                    }
                }
            },
            orderBy:{
                createdAt: 'desc'
            },
            
        })
        const total = await this.prismaService.post.count({
            where: {
                OR: [
                    {
                        title:{
                            contains: search,
                        }
                    },
                    {
                        summary:{
                            contains: search,
                        }
                    },
                    {
                        content:{
                            contains: search,
                        }
                    }
                ],
                AND: [
                    {
                        status: 1
                    }
                ]
            },
        })
        const lastPage = Math.ceil(total/items_per_page);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const previousPage = page - 1 < 1 ? null : page - 1;
        return{ 
            data:posts,
            total,
            nextPage,
            previousPage,
            currentPage: page,
            itemsPerPage: items_per_page
        }
    }
    async getDetail(id: number):Promise<Lesson>{
        return this.prismaService.lesson.findUnique({where: {id,status: 1}})
    }
    async create(data: CreateLessonDto):Promise<Lesson>{
        try{
            return await this.prismaService.lesson.create({
                data: {...data,course_id: Number(data.course_id),level: Number(data.level)}
            })
        }catch(err){
            console.log(err)
            throw new HttpException('can not create lesson', HttpStatus.BAD_REQUEST)
        }
    }
    async delete(id: number){
        return await this.prismaService.lesson.update({
            where:{id},
            data:{
                status: 0,
                deletedAt: new Date()
        }})
    }
    async update(id: number, data:UpdateLessonDto):Promise<Lesson>{
        return this.prismaService.lesson.update({where:{id}, data})
    }
}

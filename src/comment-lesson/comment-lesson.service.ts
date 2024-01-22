import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.servcie';
import { CommentLessonFilterType, CommentLessonPaginationResponseType, CreateCommentLessonDto, UpdateCommentLessonDto } from './dto/comment-lesson.dto';
import { CommentLesson } from '@prisma/client';

@Injectable()
export class CommentLessonService {
    constructor(private prismaService: PrismaService){}
    async create(data: CreateCommentLessonDto):Promise<CommentLesson>{
        return await this.prismaService.commentLesson.create({data:{...data, author_id: Number(data.author_id), lesson_id: Number(data.lesson_id)}})
    }
    async getDetail(id:number){
        return await this.prismaService.commentLesson.findUnique({
            where:{id,status:1}
        })
    }
    async getAll(filters:CommentLessonFilterType):Promise<CommentLessonPaginationResponseType>{
        const items_per_page = Number(filters.items_per_page) || 10;
        const page = Number(filters.page) || 1
        const search = filters.search || ''
        const skip = page > 1 ? (page - 1) * items_per_page : 0
        const commentLessons = await this.prismaService.commentLesson.findMany({
            take: items_per_page,
            skip,
            where: {
                OR: [
                    {
                        message:{
                            contains: search,
                        }
                    },
                ],
                AND: [
                    {
                        status: 1
                    }
                ],
                
            },
            include:{
                ownership_lesson:{
                    select:{
                        title:true,
                        level:true
                    }
                },
                author:{
                    select:{
                        email:true
                    }
                }
            },
            orderBy:{
                createdAt: 'desc'
            },
            
        })
        const total = await this.prismaService.commentLesson.count({
            where: {
                OR: [
                    {
                        message:{
                            contains: search,
                        }
                    },
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
            data:commentLessons,
            total,
            nextPage,
            previousPage,
            currentPage: page,
            itemsPerPage: items_per_page
        }
    }
    async update(id:number,data: UpdateCommentLessonDto):Promise<CommentLesson>{
        return await this.prismaService.commentLesson.update({where:{id},data})
    }
    async delete(id:number){
        return await this.prismaService.commentLesson.update({where:{id},data:{status:0, deletedAt: new Date}})
    }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.servcie';
import { CommentPostFilterType, CommentPostPaginationResponseType, CreateCommentPostDto, UpdateCommentPostDto } from './dto/comment-post.dto';
import { CommentPost } from '@prisma/client';

@Injectable()
export class CommentPostService {
    constructor(private prismaService: PrismaService){}
    async create(data: CreateCommentPostDto):Promise<CommentPost>{
        return await this.prismaService.commentPost.create({data:{...data, author_id: Number(data.author_id), post_id: Number(data.post_id)}})
    }
    async getDetail(id: number):Promise<CommentPost>{
        return await this.prismaService.commentPost.findUnique({where:{id,status:1}})
    }
    async getAll(filters: CommentPostFilterType):Promise<CommentPostPaginationResponseType>{
        const items_per_page = Number(filters.items_per_page) || 10;
        const page = Number(filters.page) || 1
        const search = filters.search || ''
        const skip = page > 1 ? (page - 1) * items_per_page : 0
        const CommentPosts = await this.prismaService.commentPost.findMany({
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
                ownership_post:{
                    select:{
                        title:true,
                    }
                },
                author:{
                    select:{
                        email:true
                    }
                },
            },
            orderBy:{
                createdAt: 'desc'
            },
            
        })
        const total = await this.prismaService.commentPost.count({
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
            data:CommentPosts,
            total,
            nextPage,
            previousPage,
            currentPage: page,
            itemsPerPage: items_per_page
        }
    }
    async update(id: number, data: UpdateCommentPostDto){
        return await this.prismaService.commentLesson.update({where:{id},data})
    }
    async delete(id:number){
        return await this.prismaService.commentLesson.update({where:{id},data:{status:0,deletedAt:new Date}})
    }
}

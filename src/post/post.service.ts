import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.servcie';
import { CreatePostDto, PostFilterType, PostPaginationResponseType, UpdatePostDto } from './dto/posts.dto';
import { Post } from '@prisma/client';

@Injectable()
export class PostService {
    constructor(private prismaService: PrismaService){}
    async create(id:number,data: CreatePostDto):Promise<Post>{
        try{
            return await this.prismaService.post.create({
                data: {...data, ownerId:id,categoryId: Number(data.categoryId)}
            })
        }catch(err){
            console.log(err)
            throw new HttpException('can not create post', HttpStatus.BAD_REQUEST)
        }
    }
    async getAll(filters: PostFilterType): Promise<PostPaginationResponseType>{
        const items_per_page = Number(filters.items_per_page) || 10;
        const page = Number(filters.page) || 1
        const search = filters.search || ''
        const skip = page > 1 ? (page - 1) * items_per_page : 0
        const posts = await this.prismaService.post.findMany({
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
                ],
                
            },
            include:{
                owner:{
                    select:{
                        id:true,
                        username: true,
                        email:true
                    }
                },
                category:{
                    select:{
                        id:true,
                        name:true,
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
    async getDetail(id:number):Promise<Post>{
        return this.prismaService.post.findUnique({
            where:{id,status:1},
            include:{
                owner:{
                    select:{
                        id:true,
                        username: true,
                        email:true
                    }
                },
                category:{
                    select:{
                        id:true,
                        name:true,
                    }
                }
            },
        })
    }
    async update(id:number,data: UpdatePostDto):Promise<Post>{
        try{
            return await this.prismaService.post.update({
                where:{id},
                data: {...data,categoryId: Number(data.categoryId)}
            })
        }catch(err){
            console.log(err)
            throw new HttpException('can not update post', HttpStatus.BAD_REQUEST)
        }
    }
    async delete(id: number){
        return await this.prismaService.post.update({
            where:{id},
            data:{
                status: 0,
                deletedAt: new Date()
            }})
    }
    async multipleDelete(ids: Number[]){
        const updatePromises = ids.map(async (id) => {
            try {
                const updatedPost = await this.prismaService.post.update({
                    where: { id: Number(id), status: 1},
                    data: {
                        status: 0,
                        deletedAt: new Date(),
                    },
                    select: {
                        status: true,
                        deletedAt: true,
                    },
                });
                if (!updatedPost) {
                    throw new NotFoundException(`Post with ID ${id} not found`);
                }
                return updatedPost;
            } catch (error) {
                // Handle the error, for example, log it and continue with the next iteration
                console.error(`Error updating user with ID ${id}:`, error.message);
                return null;
            }
        });
        const updatedResults = await Promise.all(updatePromises);
        updatedResults.filter(result => result !== null); 
        return updatedResults
    }
    
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostTag } from '@prisma/client';
import { PrismaService } from 'src/prisma.servcie';
import { CreatePostTagDto, PostTagFilterType, PostTagPaginationResponseType } from './dto/post-tag.dto';


@Injectable()
export class PostTagService {
    constructor(private prismaService: PrismaService){}
    async create(data:CreatePostTagDto):Promise<PostTag>{
        try{
            return await this.prismaService.postTag.create({
                data: {...data,post_id:Number(data.post_id), tag_id:Number(data.tag_id)}
            })
        }catch(err){
            console.log(err)
            throw new HttpException('can not create PostTag', HttpStatus.BAD_REQUEST)
        }
    }
    async getAll(filters:PostTagFilterType):Promise<PostTagPaginationResponseType>{
        const items_per_page = Number(filters.items_per_page) || 10;
        const page = Number(filters.page) || 1
        const search = filters.search || ''
        const skip = page > 1 ? (page - 1) * items_per_page : 0
        const postTags = await this.prismaService.postTag.findMany({
            take: items_per_page,
            skip,
            include:{
                ownership_post:{
                    select:{
                        title:true
                    }
                },
                ownership_tag:{
                    select:{
                        name:true,
                    }
                }
            },
            orderBy:{
                createdAt:'desc'
            },
            
        })
        const total = await this.prismaService.postTag.count()
        const lastPage = Math.ceil(total/items_per_page);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const previousPage = page - 1 < 1 ? null : page - 1;
        return{ 
            data:postTags,
            total,
            nextPage,
            previousPage,
            currentPage: page,
            itemsPerPage: items_per_page
        }
    }
    async delete(id:number){
        return await this.prismaService.postTag.delete({where:{id}})
    }
}

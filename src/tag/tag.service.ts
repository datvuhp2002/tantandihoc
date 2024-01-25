import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.servcie';
import { CreateTagDto, TagFilterType, TagPaginationResponseType, UpdateTagDto } from './dto/tag.dto';
import { Tag } from '@prisma/client';

@Injectable()
export class TagService {
    constructor(private prismaService: PrismaService){}
    async create(data:CreateTagDto):Promise<Tag>{
        try{
            return this.prismaService.tag.create({data})
        }catch(err){
            throw new HttpException('không thể tạo tag',HttpStatus.BAD_REQUEST)
        }
    }
    async getDetail(id:number):Promise<Tag>{
        try{
            return this.prismaService.tag.findUnique({where:{id, status:1}})
        }catch(err){
            throw new HttpException('không tìm thấy tag',HttpStatus.BAD_REQUEST)
        }
    }
    async getAll(filters:TagFilterType):Promise<TagPaginationResponseType>{
        const items_per_page = Number(filters.items_per_page) || 10;
        const page = Number(filters.page) || 1
        const search = filters.search || ''
        const skip = page > 1 ? (page - 1) * items_per_page : 0
        const tags = await this.prismaService.tag.findMany({
            take: items_per_page,
            skip,
            where: {
                OR: [
                    {
                        name:{
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
            orderBy:{
                createdAt:'desc'
            },
            
        })
        const total = await this.prismaService.tag.count({
            where: {
                OR: [
                    {
                        name:{
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
            data:tags,
            total,
            nextPage,
            previousPage,
            currentPage: page,
            itemsPerPage: items_per_page
        }
    }
    async update(id:number,data:UpdateTagDto){
        try{
            return await this.prismaService.tag.update({
                where:{id,status:1},
                data
            })
        }catch(err){
            throw new HttpException('can not update Tag',HttpStatus.BAD_REQUEST)
        }
    }
    async delete(id:number){
        return await this.prismaService.tag.update({
            where:{id},
            data:{status:0,deletedAt:new Date}
        })
    }
    
}

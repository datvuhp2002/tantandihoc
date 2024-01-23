import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.servcie';
import { CreateVocabularyDto, UpdateVocabularyDto, VocabularyFilterType, VocabularyPaginationResponseType } from './dto/vocabulary.dto';
import { Vocabulary } from '@prisma/client';

@Injectable()
export class VocabularyService {
    constructor(private prismaService: PrismaService){}
    async create(data:CreateVocabularyDto):Promise<Vocabulary>{
        try{
            return await this.prismaService.vocabulary.create({
                data: {...data,lesson_id:Number(data.lesson_id), category_id:Number(data.category_id)}
            })
        }catch(err){
            console.log(err)
            throw new HttpException('can not create vocabulary', HttpStatus.BAD_REQUEST)
        }
    }
    async getDetail(id:number):Promise<Vocabulary>{
        return await this.prismaService.vocabulary.findUnique({where:{id}})
    }
    async getAll(filters:VocabularyFilterType):Promise<VocabularyPaginationResponseType>{
        const items_per_page = Number(filters.items_per_page) || 10;
        const page = Number(filters.page) || 1
        const search = filters.search || ''
        const skip = page > 1 ? (page - 1) * items_per_page : 0
        const vocabularies = await this.prismaService.vocabulary.findMany({
            take: items_per_page,
            skip,
            where: {
                OR: [
                    {
                        word:{
                            contains: search,
                        }
                    },
                    {
                        meaning:{
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
                        title:true
                    }
                },
                ownership_category:{
                    select:{
                        name:true,
                    }
                }
            },
            orderBy:{
                createdAt:'desc'
            },
            
        })
        const total = await this.prismaService.vocabulary.count({
            where: {
                OR: [
                    {
                        word:{
                            contains: search,
                        }
                    },
                    {
                        meaning:{
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
            data:vocabularies,
            total,
            nextPage,
            previousPage,
            currentPage: page,
            itemsPerPage: items_per_page
        }
    }
    async update(id:number,data:UpdateVocabularyDto){
        try{
            return await this.prismaService.vocabulary.update({
                where:{id,status:1},
                data
            })
        }catch(err){
            throw new HttpException('can not update vocabulary',HttpStatus.BAD_REQUEST)
        }
    }
    async delete(id:number){
        return await this.prismaService.vocabulary.update({
            where:{id},
            data:{status:0,deletedAt:new Date}
        })
    }
}

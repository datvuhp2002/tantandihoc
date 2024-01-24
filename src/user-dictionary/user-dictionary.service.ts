import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/prisma.servcie';
import { CreateUserDictionaryDto, UserDictionaryFilterType, UserDictionaryPaginationResponseType } from './dto/user-dictionary.dto';
import { UserDictionary } from '@prisma/client';

@Injectable()
export class UserDictionaryService {
    constructor(private prismaService: PrismaService){}
    async create(data: CreateUserDictionaryDto):Promise<UserDictionary>{
        try{
            return this.prismaService.userDictionary.create({data:{...data, vocabulary_id:Number(data.vocabulary_id)}})
        }catch(err){
            throw new HttpException('không thể tạo user dictionary',HttpStatus.BAD_REQUEST)
        }
    }
    async getAll(filters:UserDictionaryFilterType):Promise<UserDictionaryPaginationResponseType>{
        const items_per_page = Number(filters.items_per_page) || 10;
        const page = Number(filters.page) || 1
        const skip = page > 1 ? (page - 1) * items_per_page : 0
        const userDictionaries = await this.prismaService.userDictionary.findMany({
            take: items_per_page,
            skip,
            where: {
                status: 1
            },
            orderBy:{
                createdAt:'desc'
            },
            
        })
        const total = await this.prismaService.userDictionary.count({
            where: {
                status: 1
        }})
        const lastPage = Math.ceil(total/items_per_page);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const previousPage = page - 1 < 1 ? null : page - 1;
        return{ 
            data:userDictionaries,
            total,
            nextPage,
            previousPage,
            currentPage: page,
            itemsPerPage: items_per_page
        }
    }
    async delete(id:number){
        return this.prismaService.userDictionary.update({where:{id},data:{status:0,deletedAt:new Date}})
    }
}

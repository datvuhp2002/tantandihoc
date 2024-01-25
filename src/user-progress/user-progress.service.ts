import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserProgress } from '@prisma/client';
import { PrismaService } from 'src/prisma.servcie';
import { CreateUserProgressDto, UpdateUserProgressDto, UserProgressFilterType, UserProgressPaginationResponseType } from './dto/user-progress.dto';

@Injectable()
export class UserProgressService {
    constructor(private prismaService: PrismaService){}
    async create(data:CreateUserProgressDto):Promise<UserProgress>{
        try{
            return await this.prismaService.userProgress.create({
                data: {...data}
            })
        }catch(err){
            console.log(err)
            throw new HttpException('can not create UserProgress', HttpStatus.BAD_REQUEST)
        }
    }
    async getDetail(id:number):Promise<UserProgress>{
        return await this.prismaService.userProgress.findUnique({where:{id}})
    }
    async getAll(filters:UserProgressFilterType):Promise<UserProgressPaginationResponseType>{
        const items_per_page = Number(filters.items_per_page) || 10;
        const page = Number(filters.page) || 1
        const search = filters.search || ''
        const skip = page > 1 ? (page - 1) * items_per_page : 0
        const vocabularies = await this.prismaService.userProgress.findMany({
            take: items_per_page,
            skip,
            where: {
                        status: 1                
            },
            include:{
                onswership_course:{
                    select:{
                        name:true
                    }
                },
                ownership_lesson:{
                    select:{
                        title:true
                    }
                },
                onwership_quiz:{
                }
            },
            orderBy:{
                createdAt:'desc'
            },
            
        })
        const total = await this.prismaService.userProgress.count({
            where: {
                        status: 1
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
    async update(id:number,data:UpdateUserProgressDto){
        try{
            return await this.prismaService.userProgress.update({
                where:{id,status:1},
                data
            })
        }catch(err){
            throw new HttpException('can not update UserProgress',HttpStatus.BAD_REQUEST)
        }
    }
    async delete(id:number){
        return await this.prismaService.userProgress.update({
            where:{id},
            data:{status:0,deletedAt:new Date}
        })
    }
}

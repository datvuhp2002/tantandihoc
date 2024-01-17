import { Injectable } from '@nestjs/common';
import { Course } from '@prisma/client';
import { PrismaService } from 'src/prisma.servcie';
import { CourseFilterType, CoursePaginationResponseType,createCourseDto } from './dto/course.dto';

@Injectable()
export class CourseService {
    constructor(private prismaService: PrismaService){}
    async create(data: createCourseDto):Promise<Course>{
        return await this.prismaService.course.create({data});
    }
    async getDetail(id:number){
        return await this.prismaService.course.findUnique({where: {id,status: 1}});
    }
    async getAll(filters:CourseFilterType):Promise<CoursePaginationResponseType>{
        const items_per_page = Number(filters.items_per_page) || 10;
        const page = Number(filters.page) || 1
        const search = filters.search || ''
        const skip = page > 1 ? (page - 1) * items_per_page : 0
        const courses = await this.prismaService.course.findMany({
            take: items_per_page,
            skip,
            where: {
                OR: [
                    {
                        name:{
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
            orderBy:{
                createdAt: 'desc'
            },
        })
        const total = await this.prismaService.course.count({
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
            data:courses,
            total,
            nextPage,
            previousPage,
            currentPage: page,
            itemsPerPage: items_per_page
        }
    }
    async delete(id:number){
        return await this.prismaService.course.update({
            where:{id},
            data:{
                status: 0,
                deletedAt: new Date()
            }})
    }
}

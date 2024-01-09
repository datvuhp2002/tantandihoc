import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.servcie';
import { UserFilterType, UserPaginationResponseType } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService){

    }
    async getAll(filters: UserFilterType): Promise<UserPaginationResponseType>{
        const items_per_page = Number(filters.items_per_page) || 10;
        const page = Number(filters.page) || 1
        const search = filters.search || ''
        const skip = page > 1 ? (page - 1) * items_per_page : 0
        const users = await this.prismaService.user.findMany({
            take: items_per_page,
            skip,
            select: {
                username: true,
                email: true,
                avatar: true,
                createdAt: true,
            },
            where: {
                OR: [
                    {
                        username:{
                            contains: search,
                        }
                    },
                    {
                        email:{
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
            orderBy:{
                createdAt: 'desc'
            }
        })
        const total = await this.prismaService.user.count({
            where: {
                OR: [
                    {
                        username:{
                            contains: search,
                        }
                    },
                    {
                        email:{
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
        return{ 
            data:users,
            total,
            currentPage: page,
            itemsPerPage: items_per_page
        }
    }
}

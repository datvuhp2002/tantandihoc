import { User } from "@prisma/client"
import { IsEmail, IsNotEmpty, isNotEmpty, IsOptional, MinLength } from "class-validator"
export class CreateUserDto {
    @IsNotEmpty()
    username: string
    @IsNotEmpty()
    @IsEmail()
    email: string
    @IsNotEmpty()
    @MinLength(6)
    password: string
    status: number
}

export interface UserFilterType{
    items_per_page?:number
    page?:number
    search?:string
}
export interface UserPaginationResponseType{
    data: {username: string; email: string,avatar: string,createdAt:Date }[];
    total: number
    currentPage: number
    itemsPerPage?:number
} 
export class UpdateUserDto{
    name: string
    status: number
}
import { Tag } from "@prisma/client";
import { IsNotEmpty } from "class-validator";
export class CreateTagDto{
    @IsNotEmpty()
    name:string
}
export interface TagFilterType{
    items_per_page?:number
    page?:number
    search?:string
    nextPage?: number
    previousPage?: number
}
export interface TagPaginationResponseType{
    data: Tag[];
    total: number
    currentPage: number
    nextPage?: number
    previousPage?: number
    itemsPerPage?:number
} 
export class UpdateTagDto{
    name:string
}
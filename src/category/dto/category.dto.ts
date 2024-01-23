import { Category } from "@prisma/client";
import { IsNotEmpty } from "class-validator";
export class CreateCategoryDto{
    @IsNotEmpty()
    name:string
    @IsNotEmpty()
    description:string
}
export interface CategoryFilterType{
    items_per_page?:number
    page?:number
    search?:string
    nextPage?: number
    previousPage?: number
}
export interface CategoryPaginationResponseType{
    data: Category[];
    total: number
    currentPage: number
    nextPage?: number
    previousPage?: number
    itemsPerPage?:number
} 
export class UpdateCategoryDto{
    name:string
    description:string
}
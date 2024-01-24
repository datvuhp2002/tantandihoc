import { SavedPost } from "@prisma/client";
import { IsNotEmpty } from "class-validator";
export class CreateSavedPostDto{
    @IsNotEmpty()
    author_id: number
    @IsNotEmpty()
    post_id: number
}
export interface SavedPostFilterType{
    items_per_page?:number
    page?:number
    search?: string
    nextPage?: number
    previousPage?: number
}
export interface SavedPostPaginationResponseType{
    data: SavedPost[];
    total: number
    currentPage: number
    nextPage?: number
    previousPage?: number
    itemsPerPage?:number
} 

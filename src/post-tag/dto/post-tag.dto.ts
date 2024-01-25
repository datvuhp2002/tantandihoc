import { PostTag } from "@prisma/client";
import { IsNotEmpty } from "class-validator";
export class CreatePostTagDto{
    @IsNotEmpty()
    post_id:number
    @IsNotEmpty()
    tag_id:number
}
export interface PostTagFilterType{
    items_per_page?:number
    page?:number
    search?:string
    nextPage?: number
    previousPage?: number
}
export interface PostTagPaginationResponseType{
    data: PostTag[];
    total: number
    currentPage: number
    nextPage?: number
    previousPage?: number
    itemsPerPage?:number
} 

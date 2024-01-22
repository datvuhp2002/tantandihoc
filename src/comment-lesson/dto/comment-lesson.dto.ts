import { CommentLesson } from "@prisma/client";
import { IsNotEmpty } from "class-validator";
export class CreateCommentLessonDto{
    @IsNotEmpty()
    message:string
    @IsNotEmpty()
    author_id:number
    @IsNotEmpty()
    lesson_id:number
}
export interface CommentLessonFilterType{
    items_per_page?:number
    page?:number
    search?:string
    nextPage?: number
    previousPage?: number
}
export interface CommentLessonPaginationResponseType{
    data: CommentLesson[];
    total: number
    currentPage: number
    nextPage?: number
    previousPage?: number
    itemsPerPage?:number
} 
export class UpdateCommentLessonDto{
    message:string;
}
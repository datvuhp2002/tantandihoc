import { Lesson } from "@prisma/client";
import { IsNotEmpty, IsOptional } from "class-validator";
export class CreateLessonDto{
    @IsNotEmpty()
    title: string
    @IsNotEmpty()
    content:string
    thumbnail:string
    @IsNotEmpty()
    level:number
    @IsNotEmpty()
    course_id:number
}
export interface LessonFilterType{
    items_per_page?:number
    page?:number
    search?:string
    nextPage?: number
    previousPage?: number
}
export interface LessonPaginationResponseType{
    data: Lesson[];
    total: number
    currentPage: number
    nextPage?: number
    previousPage?: number
    itemsPerPage?:number
} 
export class UpdateLessonDto{}
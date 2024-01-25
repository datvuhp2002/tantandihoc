import { UserProgress } from "@prisma/client";
import { IsNotEmpty, IsOptional } from "class-validator";
export class CreateUserProgressDto{
    @IsNotEmpty()
    author_id: number
}
export interface UserProgressFilterType{
    items_per_page?:number
    page?:number
    search?:string
    nextPage?: number
    previousPage?: number
}
export interface UserProgressPaginationResponseType{
    data: UserProgress[];
    total: number
    currentPage: number
    nextPage?: number
    previousPage?: number
    itemsPerPage?:number
} 
export class UpdateUserProgressDto{
    course_id?: number
    lesson_id?: number
    quiz_id?:  number
    score?:     number
}
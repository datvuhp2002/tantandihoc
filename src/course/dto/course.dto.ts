import { Course } from "@prisma/client"
import { IsNotEmpty } from "class-validator"

export class createCourseDto{
    @IsNotEmpty()
    name:string
    thumbnail:string
}
export interface CourseFilterType{
    items_per_page?:number
    page?:number
    search?:string
    nextPage?: number
    previousPage?: number
}
export interface CoursePaginationResponseType{
    data: Course[];
    total: number
    currentPage: number
    nextPage?: number
    previousPage?: number
    itemsPerPage?:number
} 
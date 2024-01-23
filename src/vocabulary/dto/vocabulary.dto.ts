import { Vocabulary } from "@prisma/client";
import { IsNotEmpty } from "class-validator";
export class CreateVocabularyDto{
    @IsNotEmpty()
    word:string
    @IsNotEmpty()
    meaning:string
    @IsNotEmpty()
    lesson_id:number
    @IsNotEmpty()
    category_id:number
}
export interface VocabularyFilterType{
    items_per_page?:number
    page?:number
    search?:string
    nextPage?: number
    previousPage?: number
}
export interface VocabularyPaginationResponseType{
    data: Vocabulary[];
    total: number
    currentPage: number
    nextPage?: number
    previousPage?: number
    itemsPerPage?:number
} 
export class UpdateVocabularyDto{
    @IsNotEmpty()
    word:string
    @IsNotEmpty()
    meaning:string
}
import { UserDictionary } from "@prisma/client";
import { IsNotEmpty } from "class-validator";
export class CreateUserDictionaryDto{
    @IsNotEmpty()
    author_id: number
    @IsNotEmpty()
    vocabulary_id: number
}
export interface UserDictionaryFilterType{
    items_per_page?:number
    page?:number
    nextPage?: number
    previousPage?: number
}
export interface UserDictionaryPaginationResponseType{
    data: UserDictionary[];
    total: number
    currentPage: number
    nextPage?: number
    previousPage?: number
    itemsPerPage?:number
} 

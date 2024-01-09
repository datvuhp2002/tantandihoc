import { Controller, Query, Get} from '@nestjs/common';
import { UserService } from './user.service';
import { UserFilterType, UserPaginationResponseType } from './dto/user.dto';

@Controller('users')
export class UserController {
    constructor(private userService: UserService){
    }
    @Get()
    getAll(@Query() params:UserFilterType): Promise<UserPaginationResponseType>{
        console.log("get all user api", params);
        return this.userService.getAll(params);
    }
}

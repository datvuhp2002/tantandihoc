import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector){}
    canActivate(context: ExecutionContext): boolean {
        console.log("access RolesGuard")
        const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles',[
            context.getHandler(),
            context.getClass()
        ])
        console.log('required roles =>' , requiredRoles)
        if(!requiredRoles){
            return true;
        }
        const {user} = context.switchToHttp().getRequest()
        console.log("User =>",user)
        return requiredRoles.some(role => user.roles.split(',').includes(role));
    }
}
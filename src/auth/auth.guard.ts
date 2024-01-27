import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { PrismaService } from "src/prisma.servcie";
@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private reflector:Reflector,
        private prismaService: PrismaService
    ){}
    async canActivate(context: ExecutionContext):Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const isPublic = this.reflector.getAllAndOverride<string[]>('isPublic',[
            context.getHandler(),
            context.getClass()
        ])
        if(isPublic) return true
        const token = this.extractTokenFromHeader(request);
        if(!token){
            throw new UnauthorizedException();
        }
        try{
            const payload = await this.jwtService.verifyAsync(token,{
                secret: this.configService.get<string>('SECRET')
            })
            const user = await this.prismaService.user.findUnique({where:{id: payload.id}})
            request['user'] = user
            request['user_data'] = payload; 
        }catch(e){
            console.log('Khong the dang nhap',e)
            throw new UnauthorizedException();
        }
        return true;
    }
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
      }
}
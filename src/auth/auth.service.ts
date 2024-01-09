import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.servcie';
import { LoginUserDto, RegisterUserDto } from './dto/registerUserDto.dto';
import * as bcrypt from "bcrypt"
@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService,
        private jwtService: JwtService){}
    register = async (userData: RegisterUserDto):Promise<User> => {
        // step 1 : checking email has already used
        const user = await this.prismaService.user.findUnique({
            where:{
                email: userData.email
            }
        })

        if(user){
            throw new HttpException({message:'Email has been used'},HttpStatus.BAD_REQUEST)
        }
        // step 2: hash password and store to db
        const hashPassword = await this.hashPasword(user.password)
        
        const res = await this.prismaService.user.create({
            data: {...userData, password: hashPassword}
        })
        return res
    }
    login = async (data: {email:string, password:string}):Promise<any> =>{
        // step 1: checking is exist by email
        const user = await this.prismaService.user.findUnique({
            where:{
                email:data.email,
                status: 1
            }
        })
        if(!user){
            throw new HttpException({message: "Account is not exist"},HttpStatus.UNAUTHORIZED)
        }
        //step 2: check password
        const verify = await bcrypt.compareSync(data.password, user.password)
        if(!verify) throw new HttpException({message: "Password does not correct"},HttpStatus.UNAUTHORIZED)
        // step 3: generate access token and refresh token 
        const payload = {id:user.id, username: user.username, email: user.email}
        return this.generateToken(payload)
    }

    private async generateToken(payload:{id:number, email:string}):Promise<any>{
        const access_token = await this.jwtService.signAsync(payload,{
            secret: process.env.SECRET,
            expiresIn: process.env.EXPIRES_ACCESS_TOKEN
        })
        const refresh_token = await this.jwtService.signAsync(payload,{
            secret: process.env.SECRET,
            expiresIn: process.env.EXPIRES_REFRESH_TOKEN
        })
        await this.prismaService.user.update({
            where: { id: payload.id },
            data: {
                email: payload.email,
                refresh_token
            },
        });
        return {access_token, refresh_token};
    }
    private async hashPasword(password: String):Promise<string>{
        const salt = await bcrypt.genSalt(Number(process.env.SALTROUND));
        const hash = await bcrypt.hash(password, salt)
        return hash;
    }
    async refreshToken(refresh_token: string):Promise<any>{
        try{
            const verify = await this.jwtService.verifyAsync(refresh_token,{
                secret: process.env.ACCESS_TOKEN_KEY
            })
            console.log(verify)
            const checkExist = await this.prismaService.user.findUnique({where:{id:verify.id, refresh_token}})
            if(checkExist){
                return this.generateToken({id: verify.id, email: verify.email})
            }else{
                throw new HttpException('refresh token is not valid',HttpStatus.BAD_REQUEST)
            }
        }catch(err){
            throw new HttpException('refresh token is not valid',HttpStatus.BAD_REQUEST)
        }
    }

}

import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
export class RegisterUserDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(6)
  password: string;
  @IsOptional()
  avatar?: string;
  status: number;
}
export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

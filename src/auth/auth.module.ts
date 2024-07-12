import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';

import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailTransporter } from 'src/email.transporter';
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: '123456',
      signOptions: { expiresIn: '1h' },
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    JwtService,
    ConfigService,
    EmailTransporter,
  ],
})
export class AuthModule {}

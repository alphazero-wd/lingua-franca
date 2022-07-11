import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [AuthResolver, AuthService, PrismaService],
  imports: [JwtModule.register({})],
})
export class AuthModule {}

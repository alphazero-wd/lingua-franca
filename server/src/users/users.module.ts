import { Module } from '@nestjs/common';
import { JwtStrategy } from '../auth/strategies';
import { PrismaService } from '../prisma/prisma.service';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  providers: [UsersResolver, PrismaService, JwtStrategy, UsersService],
})
export class UsersModule {}

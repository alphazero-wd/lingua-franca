import { UseGuards } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { Role } from '../auth/decorator';
import { CheckConfirmGuard, JwtAuthGuard, RolesGuard } from '../auth/guards';
import { CurrentUser } from './decorators';
import { UserResponse } from './interfaces';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => UserResponse)
  @UseGuards(JwtAuthGuard, CheckConfirmGuard)
  async me(@CurrentUser() user: User): Promise<User> {
    return this.usersService.me(user.id);
  }

  @Query(() => [UserResponse])
  @Role('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  users(): Promise<User[]> {
    return this.usersService.getUsers();
  }
}

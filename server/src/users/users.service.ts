import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  me(id: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
}

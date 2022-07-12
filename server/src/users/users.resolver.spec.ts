import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import { UsersResolver } from './users.resolver';

describe('UsersResolver', () => {
  let prisma: PrismaService;
  let resolver: UsersResolver;
  let user: User;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    prisma = module.get<PrismaService>(PrismaService);
    resolver = module.get<UsersResolver>(UsersResolver);
    await prisma.clearDatabase();
    user = await prisma.user.create({
      data: { id: 1, email: 'a@a.com', password: '123', username: 'a' },
    });
  });

  describe('me', () => {
    it('should return the current user', async () => {
      expect(await resolver.me(user)).toStrictEqual(user);
    });
  });

  describe('get users', () => {
    it('should return all users', async () => {
      expect(await resolver.users()).toEqual([user]);
    });
  });
});

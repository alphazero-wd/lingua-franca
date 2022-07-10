import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        AuthService,
        PrismaService,
        JwtService,
        ConfigService,
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    prisma = module.get<PrismaService>(PrismaService);
    await prisma.clearDatabase();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('signup resolver', () => {
    it('should signup', async () => {
      try {
        const { access_token } = await resolver.signup({
          username: 'a',
          email: 'a@a.com',
          password: '123',
        });
        expect(access_token).toBeDefined();
      } catch (error) {
        expect(error).toBeUndefined();
      }
    });

    it('should throw an exception when email already exists', async () => {
      try {
        const { access_token } = await resolver.signup({
          username: 'a',
          email: 'a@a.com',
          password: '123',
        });
        expect(access_token).toBeUndefined();
      } catch (error) {
        expect(error.message).toBe('User already exists.');
        expect(error.status).toBe(403);
      }
    });
  });

  describe('login resolver', () => {
    it('should throw an exception when email does not exist', async () => {
      try {
        const { access_token } = await resolver.login({
          email: 'a@b.com',
          password: '123',
        });
        expect(access_token).toBeUndefined();
      } catch (error) {
        expect(error.message).toBe('User does not exist.');
        expect(error.status).toBe(403);
      }
    });

    it('should throw an exception when password is incorrect', async () => {
      try {
        const { access_token } = await resolver.login({
          email: 'a@a.com',
          password: '122',
        });
        expect(access_token).toBeUndefined();
      } catch (error) {
        expect(error.message).toBe('Incorrect password.');
        expect(error.status).toBe(403);
      }
    });

    it('should login', async () => {
      try {
        const { access_token } = await resolver.login({
          email: 'a@a.com',
          password: '123',
        });
        expect(access_token).toBeDefined();
      } catch (error) {
        expect(error).toBeUndefined();
      }
    });
  });
});

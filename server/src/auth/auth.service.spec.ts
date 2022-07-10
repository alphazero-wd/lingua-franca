import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService, JwtService, ConfigService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    await prisma.clearDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should signup', async () => {
      try {
        const { access_token } = await service.signup({
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
        const { access_token } = await service.signup({
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

  describe('login', () => {
    it('should throw an exception when email does not exist', async () => {
      try {
        const { access_token } = await service.login({
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
        const { access_token } = await service.login({
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
        const { access_token } = await service.login({
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

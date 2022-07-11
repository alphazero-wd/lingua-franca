import {
  MailerService,
  MAILER_OPTIONS,
  MailerModule,
} from '@nestjs-modules/mailer';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ForbiddenException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { join } from 'path';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

const moduleMocker = new ModuleMocker(global);
describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let prisma: PrismaService;
  let service: AuthService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        AuthService,
        PrismaService,
        JwtService,
        ConfigService,
        MailService,
        MailerService,
        {
          name: MAILER_OPTIONS,
          provide: MAILER_OPTIONS,
          useFactory: async (config: ConfigService) => ({
            transport: config.get('MAIL_TRANSPORT'),
            defaults: {
              from: `"No Reply" <${config.get('MAIL_FROM')}>`,
            },
            template: {
              dir: join(__dirname, '../mail/templates'),
              adapter: new HandlebarsAdapter(),
              options: {
                strict: true,
              },
            },
          }),
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule, MailerModule],
    }).compile();

    service = module.get<AuthService>(AuthService);
    resolver = module.get<AuthResolver>(AuthResolver);
    prisma = module.get<PrismaService>(PrismaService);
    await prisma.clearDatabase();
  });

  describe('signup', () => {
    it('should signup', async () => {
      const expectedMsg =
        'An confirmation message has been sent to email a...a@a.com. Check both your spam and folders.';
      const { message } = await resolver.signup({
        username: 'a',
        email: 'a@a.com',
        password: '123',
      });
      expect(message).toBe(expectedMsg);
    });

    it('should throw an exception when email already exists', async () => {
      const expectedMsg = 'User already exists.';
      resolver
        .signup({
          username: 'a',
          email: 'a@a.com',
          password: '123',
        })
        .then((data) => expect(data).toBeUndefined())
        .catch((e) => expect(e.message).toBe(expectedMsg));
    });
  });

  describe('login', () => {
    it('should throw an exception when email does not exist', async () => {
      const expectedMsg = 'User does not exist.';
      resolver
        .login({
          email: 'a@b.com',
          password: '123',
        })
        .then((data) => expect(data).toBeUndefined())
        .catch((e) => expect(e.message).toBe(expectedMsg));
    });

    it('should throw an exception when password is incorrect', async () => {
      const expectedMsg = 'Incorrect password.';
      resolver
        .login({
          email: 'a@a.com',
          password: '122',
        })
        .then((data) => expect(data).toBeUndefined())
        .catch((e) => expect(e.message).toBe(expectedMsg));
    });

    it('should send an email when user is not confirmed', async () => {
      const expectedMsg =
        'An confirmation message has been sent to email a...a@a.com. Check both your spam and folders.';
      const { message, token } = await resolver.login({
        email: 'a@a.com',
        password: '123',
      });
      expect(message).toBe(expectedMsg);
      expect(token).toBeUndefined();
    });

    it('should login', async () => {
      const expectedMsg = 'Login successfully.';
      await prisma.user.update({
        where: { username: 'a' },
        data: {
          isConfirmed: true,
        },
      });
      const { message, token } = await resolver.login({
        email: 'a@a.com',
        password: '123',
      });
      await prisma.user.update({
        where: { username: 'a' },
        data: {
          isConfirmed: false,
        },
      });
      expect(message).toBe(expectedMsg);
      expect(token).toBeDefined();
    });
  });

  describe('confirm a user', () => {
    it('should confirm a user', async () => {
      const expectedMsg = 'Your account has been confirmed.';
      let user = await prisma.user.findUnique({ where: { username: 'a' } });
      const { message, token } = await resolver.confirmUser(user);
      user = await prisma.user.findUnique({ where: { username: 'a' } });
      expect(user.isConfirmed).toBeTruthy();
      expect(message).toBe(expectedMsg);
      expect(token).toBeDefined();
    });
  });
});

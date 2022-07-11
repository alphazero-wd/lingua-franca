import * as argon from 'argon2';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto, LoginDto } from './dto';
import { JwtPayload, AuthResponse } from './interfaces';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mail: MailService,
  ) {}
  async signup({
    username,
    email,
    password,
  }: SignupDto): Promise<AuthResponse> {
    try {
      const hash = await argon.hash(password);
      const user = await this.prisma.user.create({
        data: { username, email, password: hash },
      });

      const hiddenEmail = this.mail.maskEmail(email);
      await this.mail.sendUserConfirmation(
        user,
        await this.generateToken({
          sub: user.id,
          email: user.email,
        }),
      );

      return {
        message: `An confirmation message has been sent to email ${hiddenEmail}. Check both your spam and folders.`,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException('User already exists.');
      }
      throw error;
    }
  }

  async confirmUser(user: User): Promise<AuthResponse> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isConfirmed: true,
      },
    });

    const token = await this.generateToken({
      sub: user.id,
      email: user.email,
    });
    return { message: 'Your account has been confirmed.', token };
  }

  async login({ email, password }: LoginDto): Promise<AuthResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    const hiddenEmail = this.mail.maskEmail(email);
    if (!existingUser) throw new ForbiddenException('User does not exist.');
    const isValidPassword = await argon.verify(existingUser.password, password);
    if (!isValidPassword) throw new ForbiddenException('Incorrect password.');
    if (!existingUser.isConfirmed) {
      await this.mail.sendUserConfirmation(
        existingUser,
        await this.generateToken({
          sub: existingUser.id,
          email: existingUser.email,
        }),
      );

      return {
        message: `An confirmation message has been sent to email ${hiddenEmail}. Check both your spam and folders.`,
      };
    }
    const token = await this.generateToken({
      sub: existingUser.id,
      email: existingUser.email,
    });
    return { message: 'Login successfully.', token };
  }

  private generateToken(payload: JwtPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: this.config.get('JWT_SECRET'),
    });
  }
}

import * as argon from 'argon2';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto, LoginDto } from './dto';
import { JwtPayload } from './interfaces';
import { AuthResponse } from './interfaces';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup({
    username,
    email,
    password,
  }: SignupDto): Promise<AuthResponse> {
    try {
      const hash = await argon.hash(password);
      const { id } = await this.prisma.user.create({
        data: { username, email, password: hash },
      });
      const access_token = await this.generateAccessToken({
        sub: id,
        username,
      });
      return { access_token };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException('User already exists.');
      }
      throw error;
    }
  }

  async login({ email, password }: LoginDto): Promise<AuthResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!existingUser) throw new ForbiddenException('User does not exist.');
    const isValidPassword = await argon.verify(existingUser.password, password);
    if (!isValidPassword) throw new ForbiddenException('Incorrect password.');
    const access_token = await this.generateAccessToken({
      sub: existingUser.id,
      username: existingUser.username,
    });
    return { access_token };
  }

  private generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: this.config.get('JWT_ACCESS_SECRET'),
    });
  }
}

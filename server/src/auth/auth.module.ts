import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthResolver, AuthService],
  imports: [JwtModule.register({})],
})
export class AuthModule {}

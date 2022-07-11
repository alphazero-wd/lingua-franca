import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto';
import { AuthResponse } from './interfaces/Auth.interface';

@Resolver()
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => AuthResponse)
  async signup(@Args('signupDto') signupDto: SignupDto): Promise<AuthResponse> {
    return this.auth.signup(signupDto);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('loginDto') loginDto: LoginDto): Promise<AuthResponse> {
    return this.auth.login(loginDto);
  }
}

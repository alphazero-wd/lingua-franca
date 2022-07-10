import { IsEmail, IsNotEmpty, Length, MinLength } from 'class-validator';
export class SignupDto {
  @Length(1, 30)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(6)
  password: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

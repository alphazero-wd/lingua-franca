import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

const USERNAME_REGEX = /(?=.{1,30}$)[a-zA-Z0-9_]+(?<![_])$/;
const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
@InputType()
export class SignupDto {
  @Field()
  // 1-30 characters long, only numbers and underscores
  @Matches(USERNAME_REGEX, {
    message:
      'Username must be between 1-30 characters, containing numbers and underscores.',
  })
  username: string;

  @Field()
  @IsNotEmpty({ message: 'Please enter your email.' })
  @IsEmail({ message: 'This is not a valid email.' })
  email: string;

  // Password must be at least 6 characters, contain a lowercase and uppercase letter and a special character.
  @Field()
  @IsNotEmpty({ message: 'Please enter your password.' })
  @Matches(PASSWORD_REGEX, {
    message: 'Password is too weak.',
  })
  password: string;
}

@InputType()
export class LoginDto {
  @Field()
  @IsNotEmpty({ message: 'Please enter your email.' })
  @IsEmail({ message: 'This is not an invalid email.' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Please enter your password.' })
  password: string;
}

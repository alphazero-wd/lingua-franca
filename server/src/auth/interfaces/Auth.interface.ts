import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthResponse {
  @Field()
  message: string;

  @Field({ nullable: true })
  token?: string;
}

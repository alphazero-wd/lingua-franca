import { Extensions, Field, ID, ObjectType } from '@nestjs/graphql';
import { Plan, Role, User } from '@prisma/client';
import { checkEmailMiddleware, checkRoleMiddleware } from '../middlewares';

@ObjectType()
export class UserResponse implements User {
  @Field(() => ID)
  id: number;

  @Field()
  username: string;

  @Field({ middleware: [checkEmailMiddleware] })
  email: string;

  @Field({ middleware: [checkRoleMiddleware] })
  @Extensions({ role: Role.ADMIN })
  password: string;

  @Field({ nullable: true })
  bio: string | null;

  @Field({ nullable: true })
  image: string | null;

  @Field()
  createdAt: Date;

  @Field()
  isConfirmed: boolean;

  @Field()
  role: Role;

  @Field()
  subscriptionPlanId: Plan;
}

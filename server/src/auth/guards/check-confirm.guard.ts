import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class CheckConfirmGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { req } = GqlExecutionContext.create(context).getContext();
    const user = req.user;
    if (!user.isConfirmed)
      throw new ForbiddenException('You have not confirmed your account.');
    return false;
  }
}

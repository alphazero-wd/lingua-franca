import { ForbiddenException } from '@nestjs/common';
import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const checkEmailMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const {
    source,
    context: { req },
  } = ctx;

  // if it is not the user's email and the user is not admin
  if (source.email !== req.user.email && req.user.role !== 'ADMIN')
    throw new ForbiddenException(
      'You are not allowed to see the email of this user.',
    );
  return next();
};

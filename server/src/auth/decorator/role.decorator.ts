import { SetMetadata } from '@nestjs/common';
import { Role as UserRole } from '@prisma/client';

export const Role = (role: UserRole) => SetMetadata('role', role);

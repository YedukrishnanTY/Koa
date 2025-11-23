// roles.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // No required roles → route open to any authenticated user
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const req = context.switchToHttp().getRequest();
        const user = req.user;

        // Not authenticated
        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }

        const userRoles: string[] = Array.isArray(user.roles) ? user.roles : [];

        // If user has no roles, deny immediately
        if (!userRoles || userRoles.length === 0) {
            throw new ForbiddenException('Insufficient role');
        }

        // Allow if any required role exists in userRoles
        const hasRole = requiredRoles.some(role => userRoles.includes(role));
        if (!hasRole) {
            throw new ForbiddenException('Insufficient role');
        }

        return true;
    }
}

// jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

function cookieExtractor(req: Request) {
  return req?.headers?.authorization?.split(' ')?.[1] ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default-secret',
    });
  }

  async validate(payload: any) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token');
    }

    const roles = Array.isArray(payload.role)
      ? payload.role.map((r: string) => String(r).toUpperCase())
      : [];

    return {
      userId: payload.sub,
      name: payload.name,
      roles,
    };
  }
}

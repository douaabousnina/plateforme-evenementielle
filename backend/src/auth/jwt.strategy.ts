import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from '../common/enums/role.enum';
import { AuthService } from './auth.service';
import { env } from 'process';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET || 'default',
    });         
  }

  async validate(payload: any) {
    return { sub: payload.sub, email: payload.email, role: payload.role as Role};
  }
}
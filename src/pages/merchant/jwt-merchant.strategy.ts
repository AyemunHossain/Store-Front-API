import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserJwtPayload } from '../../interfaces/user.interface';
import { PASSPORT_MERCHANT_TOKEN_TYPE, PASSPORT_USER_TOKEN_TYPE } from '../../core/global-variables';

@Injectable()
export class JwtMerchantStrategy extends PassportStrategy(
  Strategy,
  PASSPORT_MERCHANT_TOKEN_TYPE,
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('merchant'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('merchantJwtSecret'),
    });
  }

  async validate(payload: UserJwtPayload) {
    return { _id: payload._id, username: payload.username };
  }
}

 import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Merchant } from '../interfaces/merchant.interface';

export const GetMerchant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Merchant => {
    const request = ctx.switchToHttp().getRequest();
    // console.log('request', request);
    return request.user;
  },
);

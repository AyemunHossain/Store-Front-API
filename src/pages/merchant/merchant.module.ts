import { Module } from '@nestjs/common';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { JwtMerchantStrategy } from './jwt-merchant.strategy';
import { PASSPORT_MERCHANT_TOKEN_TYPE } from '../../core/global-variables';
import { MerchantSchema } from 'src/schema/merchant.schema';
import { SubscriptionSchema } from 'src/schema/subscription.schema';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: PASSPORT_MERCHANT_TOKEN_TYPE,
      property: 'merchant',
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('merchantJwtSecret'),
        signOptions: {
          expiresIn: configService.get<number>('merchantTokenExpiredTime'),
        },
      }),
    }),
    MongooseModule.forFeature([{ name: 'Merchant', schema: MerchantSchema }, { name: 'Subscription', schema: SubscriptionSchema }]),
  ],
  controllers: [MerchantController],
  providers: [MerchantService, JwtMerchantStrategy],
  exports: [PassportModule],
})
export class MerchantModule { }

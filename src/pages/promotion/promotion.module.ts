import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PromotionSchema } from '../../schema/promotion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Promotion', schema: PromotionSchema },
    ]),
  ],
  providers: [PromotionService],
  controllers: [PromotionController],
})
export class PromotionModule {}

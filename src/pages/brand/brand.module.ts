import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandSchema } from '../../schema/brand.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Brand', schema: BrandSchema }]),
  ],
  providers: [BrandService],
  controllers: [BrandController],
})
export class BrandModule {}

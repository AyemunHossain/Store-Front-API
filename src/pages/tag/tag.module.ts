import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TagSchema } from '../../schema/tag.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Tag', schema: TagSchema },
    ]),
  ],
  providers: [TagService],
  controllers: [TagController],
})
export class TagModule {}

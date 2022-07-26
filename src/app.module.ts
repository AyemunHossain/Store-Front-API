import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './pages/user/user.module';
import { AdminModule } from './pages/admin/admin.module';
import { UtilsModule } from './shared/utils/utils.module';
import { TagModule } from './pages/tag/tag.module';
import { UploadModule } from './pages/upload/upload.module';
import { FileFolderModule } from './pages/file-folder/file-folder.module';
import { GalleryModule } from './pages/gallery/gallery.module';
import { TechnologyModule } from './pages/technology/technology.module';
import { UserTypeModule } from './pages/user-type/user-type.module';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { InvoiceModule } from './pages/invoice/invoice.module';
import { BrandModule } from './pages/brand/brand.module';
import { ProductModule } from './pages/product/product.module';
import { PromotionModule } from './pages/promotion/promotion.module';
import { MerchantModule } from './pages/merchant/merchant.module';
import { SubscriptionModule } from './pages/subscription/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRoot(configuration().mongoCluster),
    CacheModule.register({ ttl: 432000, max: 1000, isGlobal: true }),
    AdminModule,
    UserModule,
    UtilsModule,
    TagModule,
    UploadModule,
    FileFolderModule,
    GalleryModule,
    TechnologyModule,
    UserTypeModule,
    DashboardModule,
    InvoiceModule,
    BrandModule,
    ProductModule,
    PromotionModule,
    MerchantModule,
    SubscriptionModule
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

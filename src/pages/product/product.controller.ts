import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { AdminMetaRoles } from '../../decorator/admin-roles.decorator';
import { AdminRoles } from '../../enum/admin-roles.enum';
import { AdminRolesGuard } from '../../guards/admin-roles.guard';
import { AdminMetaPermissions } from '../../decorator/admin-permissions.decorator';
import { AdminPermissions } from '../../enum/admin-permission.enum';
import { AdminPermissionGuard } from '../../guards/admin-permission.guard';
import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';
import { ResponsePayload } from '../../interfaces/response-payload.interface';
import { MongoIdValidationPipe } from '../../pipes/mongo-id-validation.pipe';
import { ProductService } from './product.service';
import {
  AddProductDto,
  FilterAndPaginationProductDto,
  OptionProductDto,
  UpdateProductDto,
} from '../../dto/product.dto';
import { AuthGuard } from '@nestjs/passport';
import { PASSPORT_MERCHANT_TOKEN_TYPE, PASSPORT_USER_TOKEN_TYPE } from 'src/core/global-variables';

@Controller('product')
export class ProductController {
  private logger = new Logger(ProductController.name);

  constructor(private productService: ProductService) {}

  /**
   * addProduct
   * insertManyProduct
   */
  @Post('/add-by-admin')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async addProductByAdmin(
    @Body()
    addProductDto: AddProductDto,
  ): Promise<ResponsePayload> {
    return await this.productService.addProduct(addProductDto);
  }

  @Post('/add-by-merchant')
  @UsePipes(ValidationPipe)
  // @UseGuards(AuthGuard(PASSPORT_MERCHANT_TOKEN_TYPE))
  async addProductByMerchant(
    @Body()
    addProductDto: AddProductDto,
  ): Promise<ResponsePayload> {
    return await this.productService.addProduct(addProductDto);
  }

  @Post('/add-by-user')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard(PASSPORT_USER_TOKEN_TYPE))
  async addProductByUser(
    @Body()
    addProductDto: AddProductDto,
  ): Promise<ResponsePayload> {
    return await this.productService.addProduct(addProductDto);
  }


  @Post('/insert-many-admin')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async insertManyProduct(
    @Body()
    body: {
      data: AddProductDto[];
      option: OptionProductDto;
    },
  ): Promise<ResponsePayload> {
    return await this.productService.insertManyProduct(body.data, body.option);
  }

  /**
   * getAllProducts
   * getProductById
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllProducts(
    @Body() filterProductDto: FilterAndPaginationProductDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.productService.getAllProducts(filterProductDto, searchString);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  @UseGuards(AdminRolesGuard)
  @UseGuards(AdminJwtAuthGuard)
  async getProductById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.productService.getProductById(id, select);
  }

  /**
   * updateProductById
   * updateMultipleProductById
   */
  @Version(VERSION_NEUTRAL)
  @Put('/update-data/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async updateProductById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ResponsePayload> {
    return await this.productService.updateProductById(id, updateProductDto);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-multiple-data-by-id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async updateMultipleProductById(
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ResponsePayload> {
    return await this.productService.updateMultipleProductById(
      updateProductDto.ids,
      updateProductDto,
    );
  }

  /**
   * deleteProductById
   * deleteMultipleProductById
   */
  @Version(VERSION_NEUTRAL)
  @Delete('/delete-data/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteProductById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.productService.deleteProductById(id, Boolean(checkUsage));
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple-data-by-id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteMultipleProductById(
    @Body() data: { ids: string[] },
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.productService.deleteMultipleProductById(
      data.ids,
      Boolean(checkUsage),
    );
  }
}

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
import { MerchantService } from './merchant.service';
import { Merchant, MerchantAuthResponse } from '../../interfaces/merchant.interface';
import { AuthGuard } from '@nestjs/passport';
import { GetMerchant } from '../../decorator/get-merchant.decorator';
import { ResponsePayload } from '../../interfaces/response-payload.interface';
import {
  AuthMerchantDto,
  CreateMerchantDto,
  FilterAndPaginationMerchantDto,
  UpdateMerchantDto,
  MerchantSelectFieldDto,
} from '../../dto/merchant.dto';
import { MongoIdValidationPipe } from '../../pipes/mongo-id-validation.pipe';
import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';
import { AdminMetaRoles } from '../../decorator/admin-roles.decorator';
import { AdminRoles } from '../../enum/admin-roles.enum';
import { AdminRolesGuard } from '../../guards/admin-roles.guard';
import { AdminMetaPermissions } from '../../decorator/admin-permissions.decorator';
import { AdminPermissions } from '../../enum/admin-permission.enum';
import { AdminPermissionGuard } from '../../guards/admin-permission.guard';
import { PASSPORT_USER_TOKEN_TYPE } from '../../core/global-variables';
import { ChangePasswordDto } from '../../dto/change-password.dto';

@Controller('merchant')
export class MerchantController {
  private logger = new Logger(MerchantController.name);

  constructor(private merchantsService: MerchantService) {}

  /**
   * Merchant Signup
   * Merchant Login
   * Merchant Signup & Login
   */

  @Post('/signup')
  @UsePipes(ValidationPipe)
  async merchantSignup(
    @Body()
    createMerchantDto: CreateMerchantDto,
  ): Promise<Merchant> {
    return await this.merchantsService.merchantSignup(createMerchantDto);
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  async merchantLogin(@Body() authMerchantDto: AuthMerchantDto): Promise<MerchantAuthResponse> {
    return await this.merchantsService.merchantLogin(authMerchantDto);
  }

  @Post('/signup-and-login')
  @UsePipes(ValidationPipe)
  async merchantSignupAndLogin(
    @Body() createMerchantDto: CreateMerchantDto,
  ): Promise<MerchantAuthResponse> {
    return await this.merchantsService.merchantSignupAndLogin(createMerchantDto);
  }

  /**
   * Logged-in Merchant Info
   * Get All Merchants (Not Recommended)
   * Get All Merchants V1 (Filter, Pagination, Select)
   * Get All Merchants V2 (Filter, Pagination, Select, Sort, Search Query)
   * Get All Merchants V3 (Filter, Pagination, Select, Sort, Search Query with Aggregation) ** Recommended
   * Get All Merchants by Search
   */

  @Version(VERSION_NEUTRAL)
  @Get('/logged-in-merchant-data')
  @UseGuards(AuthGuard(PASSPORT_USER_TOKEN_TYPE))
  async getLoggedInMerchantData(
    @Query(ValidationPipe) merchantSelectFieldDto: MerchantSelectFieldDto,
    @GetMerchant() merchant: Merchant,
  ): Promise<ResponsePayload> {
    return this.merchantsService.getLoggedInMerchantData(merchant, merchantSelectFieldDto);
  }

  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  
  // @UsePipes(ValidationPipe)
  // @AdminMetaRoles(
  //   AdminRoles.SUPER_ADMIN,
  //   AdminRoles.ADMIN,
  //   AdminRoles.EDITOR,
  //   AdminRoles.ACCOUNTANT,
  // )
  // @UseGuards(AdminRolesGuard)
  // @UseGuards(AdminJwtAuthGuard)

  async getAllMerchantsV3(
    @Body() filterMerchantDto: FilterAndPaginationMerchantDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.merchantsService.getAllMerchants(filterMerchantDto, searchString);
  }

  /**
   * Get Merchant by ID
   * Update Merchant by Id
   * Delete Merchant by Id
   */
  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN, AdminRoles.EDITOR)
  @UseGuards(AdminRolesGuard)
  @UseGuards(AdminJwtAuthGuard)
  async getMerchantById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query(ValidationPipe) merchantSelectFieldDto: MerchantSelectFieldDto,
  ): Promise<ResponsePayload> {
    return await this.merchantsService.getMerchantById(id, merchantSelectFieldDto);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-logged-in-merchant')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard(PASSPORT_USER_TOKEN_TYPE))
  async updateLoggedInMerchantInfo(
    @GetMerchant() merchant: Merchant,
    @Body() updateMerchantDto: UpdateMerchantDto,
  ): Promise<ResponsePayload> {
    return await this.merchantsService.updateLoggedInMerchantInfo(merchant, updateMerchantDto);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/change-logged-in-merchant-password')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard(PASSPORT_USER_TOKEN_TYPE))
  async changeLoggedInMerchantPassword(
    @GetMerchant() merchant: Merchant,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ResponsePayload> {
    return await this.merchantsService.changeLoggedInMerchantPassword(
      merchant,
      changePasswordDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-data/:id')
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(ValidationPipe)
  async updateMerchantById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateMerchantDto: UpdateMerchantDto,
  ): Promise<ResponsePayload> {
    return await this.merchantsService.updateMerchantById(id, updateMerchantDto);
  }

  @Version(VERSION_NEUTRAL)
  @Delete('/delete-data/:id')
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteMerchantById(
    @Param('id', MongoIdValidationPipe) id: string,
  ): Promise<ResponsePayload> {
    return await this.merchantsService.deleteMerchantById(id);
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple-data-by-id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteMultipleTaskById(
    @Body() data: { ids: string[] },
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.merchantsService.deleteMultipleMerchantById(
      data.ids,
      Boolean(checkUsage),
    );
  }
}

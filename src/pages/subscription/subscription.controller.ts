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
import { SubscriptionService } from './subscription.service';
import {
  AddSubscriptionDto,
  FilterAndPaginationSubscriptionDto,
  OptionSubscriptionDto,
  UpdateSubscriptionDto,
} from '../../dto/subscription.dto';

@Controller('subscription')
export class SubscriptionController {
  private logger = new Logger(SubscriptionController.name);

  constructor(private subscriptionService: SubscriptionService) {}

  /**
   * addSubscription
   * insertManySubscription
   */
  @Post('/add')
  @UsePipes(ValidationPipe)
  // @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  // @UseGuards(AdminRolesGuard)
  // @AdminMetaPermissions(AdminPermissions.CREATE)
  // @UseGuards(AdminPermissionGuard)
  // @UseGuards(AdminJwtAuthGuard)
  async addSubscription(
    @Body()
    addSubscriptionDto: AddSubscriptionDto,
  ): Promise<ResponsePayload> {
    console.log("addSubscriptionDto",addSubscriptionDto)
    return await this.subscriptionService.addSubscription(addSubscriptionDto);
  }

  @Post('/insert-many')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async insertManySubscription(
    @Body()
    body: {
      data: AddSubscriptionDto[];
      option: OptionSubscriptionDto;
    },
  ): Promise<ResponsePayload> {
    return await this.subscriptionService.insertManySubscription(body.data, body.option);
  }

  /**
   * getAllSubscriptions
   * getSubscriptionById
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllSubscriptions(
    @Body() filterSubscriptionDto: FilterAndPaginationSubscriptionDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.subscriptionService.getAllSubscriptions(filterSubscriptionDto, searchString);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  @UseGuards(AdminRolesGuard)
  @UseGuards(AdminJwtAuthGuard)
  async getSubscriptionById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.subscriptionService.getSubscriptionById(id, select);
  }

  /**
   * updateSubscriptionById
   * updateMultipleSubscriptionById
   */
  @Version(VERSION_NEUTRAL)
  @Put('/update-data/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async updateSubscriptionById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<ResponsePayload> {
    return await this.subscriptionService.updateSubscriptionById(id, updateSubscriptionDto);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-multiple-data-by-id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async updateMultipleSubscriptionById(
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<ResponsePayload> {
    return await this.subscriptionService.updateMultipleSubscriptionById(
      updateSubscriptionDto.ids,
      updateSubscriptionDto,
    );
  }

  /**
   * deleteSubscriptionById
   * deleteMultipleSubscriptionById
   */
  @Version(VERSION_NEUTRAL)
  @Delete('/delete-data/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteSubscriptionById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.subscriptionService.deleteSubscriptionById(id, Boolean(checkUsage));
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple-data-by-id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteMultipleSubscriptionById(
    @Body() data: { ids: string[] },
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.subscriptionService.deleteMultipleSubscriptionById(
      data.ids,
      Boolean(checkUsage),
    );
  }
}

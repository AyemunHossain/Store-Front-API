import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from '../../shared/utils/utils.service';
import { Admin } from '../../interfaces/admin.interface';
import { ResponsePayload } from '../../interfaces/response-payload.interface';
import { User } from '../../interfaces/user.interface';
import { FilterAndPaginationUserDto } from '../../dto/user.dto';
import { ErrorCodes } from '../../enum/error-code.enum';

const ObjectId = Types.ObjectId;

@Injectable()
export class DashboardService {
  private logger = new Logger(DashboardService.name);

  constructor(
    @InjectModel('Admin')
    private readonly adminModel: Model<Admin>,
    @InjectModel('User')
    private readonly userModel: Model<User>,
    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {}

  /**
   * getAdminDashboard()
   * getResources()
   * getUserDashboard()
   * getAllUsers()
   */
  async getAdminDashboard(): Promise<ResponsePayload> {
    try {
      // const countProject = await this.projectModel.countDocuments();
      // const pendingTasks = await this.taskModel
      //   .find({ isDone: false })
      //   .select('assignTo');
      //
      // // Assign Users
      // const assignUsers = [];
      // (pendingTasks as Task[]).forEach((task) => {
      //   task.assignTo.forEach((user) => {
      //     const userId = user._id.toString();
      //     if (assignUsers.indexOf(userId) === -1) {
      //       assignUsers.push(userId);
      //     }
      //   });
      // });
      //
      // const countUser = await this.userModel.countDocuments();
      // const countAdmin = await this.adminModel.countDocuments();
      // const countProjectCategory =
      //   await this.projectCategoryModel.countDocuments();
      //
      // const data = {
      //   projects: countProject,
      //   pendingTasks: pendingTasks ? pendingTasks.length : 0,
      //   freeResources: countUser - assignUsers.length,
      //   users: countUser,
      //   assignUsers: assignUsers.length,
      //   admins: countAdmin,
      //   projectCategories: countProjectCategory,
      // };

      return {
        success: true,
        message: 'Data Retrieve Success',
        data: null,
      } as ResponsePayload;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * USERS LIST
   * PROJECT LIST
   */
  async getAllUsers(
    filterUserDto: FilterAndPaginationUserDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterUserDto;
    const { pagination } = filterUserDto;
    const { sort } = filterUserDto;
    const { select } = filterUserDto;

    // Modify Id as Object ID
    if (filter && filter['designation._id']) {
      filter['designation._id'] = new ObjectId(filter['designation._id']);
    }

    if (filter && filter['userType._id']) {
      filter['userType._id'] = new ObjectId(filter['userType._id']);
    }

    // Essential Variables
    const aggregateStages = [];
    let mFilter = {};
    let mSort = {};
    let mSelect = {};
    let mPagination = {};

    // Match
    if (filter) {
      mFilter = { ...mFilter, ...filter };
    }
    if (searchQuery) {
      mFilter = {
        $and: [
          mFilter,
          {
            $or: [
              { username: { $regex: searchQuery, $options: 'i' } },
              { phoneNo: { $regex: searchQuery, $options: 'i' } },
            ],
          },
        ],
      };
    }
    // Sort
    if (sort) {
      mSort = sort;
    } else {
      mSort = { createdAt: -1 };
    }

    // Select
    if (select) {
      // Remove Sensitive Select
      delete select.password;
      mSelect = { ...mSelect, ...select };
    } else {
      mSelect = { password: 0 };
    }

    // Finalize
    if (Object.keys(mFilter).length) {
      aggregateStages.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateStages.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateStages.push({ $project: mSelect });
    }

    // Pagination
    if (pagination) {
      // Remove Sensitive Select
      delete mSelect['password'];
      if (Object.keys(mSelect).length) {
        mPagination = {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              {
                $skip: pagination.pageSize * pagination.currentPage,
              } /* IF PAGE START FROM 0 OR (pagination.currentPage - 1) IF PAGE 1*/,
              { $limit: pagination.pageSize },
              { $project: mSelect },
            ],
          },
        };
      } else {
        mPagination = {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              {
                $skip: pagination.pageSize * pagination.currentPage,
              } /* IF PAGE START FROM 0 OR (pagination.currentPage - 1) IF PAGE 1*/,
              { $limit: pagination.pageSize },
              { $project: { password: 0 } },
            ],
          },
        };
      }

      aggregateStages.push(mPagination);

      aggregateStages.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.userModel.aggregate(aggregateStages);
      if (pagination) {
        return {
          ...{ ...dataAggregates[0] },
          ...{ success: true, message: 'Success' },
        } as ResponsePayload;
      } else {
        return {
          data: dataAggregates,
          success: true,
          message: 'Success',
          count: dataAggregates.length,
        } as ResponsePayload;
      }
    } catch (err) {
      this.logger.error(err);
      if (err.code && err.code.toString() === ErrorCodes.PROJECTION_MISMATCH) {
        throw new BadRequestException('Error! Projection mismatch');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}

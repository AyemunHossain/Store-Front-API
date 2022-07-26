import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ResponsePayload } from '../../interfaces/response-payload.interface';
import { ErrorCodes } from '../../enum/error-code.enum';
import { Subscription } from '../../interfaces/subscription.interface';
import {
  AddSubscriptionDto,
  FilterAndPaginationSubscriptionDto,
  OptionSubscriptionDto,
  UpdateSubscriptionDto,
} from '../../dto/subscription.dto';
import { Cache } from 'cache-manager';

const ObjectId = Types.ObjectId;

@Injectable()
export class SubscriptionService {
  private logger = new Logger(SubscriptionService.name);
  // Cache
  private readonly cacheAllData = 'getAllSubscription';
  private readonly cacheDataCount = 'getCountSubscription';

  constructor(
    @InjectModel('Subscription')
    private readonly subscriptionModel: Model<Subscription>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * addSubscription
   * insertManySubscription
   */
  async addSubscription(addSubscriptionDto: AddSubscriptionDto): Promise<ResponsePayload> {
    
    const data = {
      name:addSubscriptionDto.name,
      days:addSubscriptionDto.days,
      postCount:addSubscriptionDto.postCount,
      endAt: new Date(+new Date() + parseInt(addSubscriptionDto.days)*24*60*60*1000),
      price:addSubscriptionDto.price,
    }
    const newData = new this.subscriptionModel(data);
    try {
      const saveData = await newData.save();
      const data = {
        _id: saveData._id,
      };

      // Cache Removed
      await this.cacheManager.del(this.cacheAllData);
      await this.cacheManager.del(this.cacheDataCount);

      return {
        success: true,
        message: 'Data Added Success',
        data,
      } as ResponsePayload;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async insertManySubscription(
    addSubscriptionsDto: AddSubscriptionDto[],
    optionSubscriptionDto: OptionSubscriptionDto,
  ): Promise<ResponsePayload> {
    const { deleteMany } = optionSubscriptionDto;
    if (deleteMany) {
      await this.subscriptionModel.deleteMany({});
    }
    try {
      const saveData = await this.subscriptionModel.insertMany(addSubscriptionsDto);
      // Cache Removed
      await this.cacheManager.del(this.cacheAllData);
      await this.cacheManager.del(this.cacheDataCount);

      return {
        success: true,
        message: `${
          saveData && saveData.length ? saveData.length : 0
        }  Data Added Success`,
      } as ResponsePayload;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * getAllSubscriptions
   * getSubscriptionById
   */

  async getAllSubscriptions(
    filterSubscriptionDto: FilterAndPaginationSubscriptionDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterSubscriptionDto;
    const { pagination } = filterSubscriptionDto;
    const { sort } = filterSubscriptionDto;
    const { select } = filterSubscriptionDto;

    /*** GET FROM CACHE ***/
    if (!pagination && !filter) {
      const cacheData: any[] = await this.cacheManager.get(this.cacheAllData);
      const count: number = await this.cacheManager.get(this.cacheDataCount);
      if (cacheData) {
        this.logger.log('Cached page');
        return {
          data: cacheData,
          success: true,
          message: 'Success',
          count: count,
        } as ResponsePayload;
      }
    }
    this.logger.log('Not a Cached page');

    // Essential Variables
    const aggregateSsubscriptiones = [];
    let mFilter = {};
    let mSort = {};
    let mSelect = {};
    let mPagination = {};

    // Match
    if (filter) {
      mFilter = { ...mFilter, ...filter };
    }
    if (searchQuery) {
      mFilter = { ...mFilter, ...{ name: new RegExp(searchQuery, 'i') } };
    }
    // Sort
    if (sort) {
      mSort = sort;
    } else {
      mSort = { createdAt: -1 };
    }

    // Select
    if (select) {
      mSelect = { ...select };
    } else {
      mSelect = { name: 1 };
    }

    // Finalize
    if (Object.keys(mFilter).length) {
      aggregateSsubscriptiones.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateSsubscriptiones.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateSsubscriptiones.push({ $project: mSelect });
    }

    // Pagination
    if (pagination) {
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
            ],
          },
        };
      }

      aggregateSsubscriptiones.push(mPagination);

      aggregateSsubscriptiones.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.subscriptionModel.find();
      if (pagination) {
        return {
          ...{ ...dataAggregates[0] },
          ...{ success: true, message: 'Success' },
        } as ResponsePayload;
      } else {
        /*** SET CACHE DATA**/
        if (!filter) {
          await this.cacheManager.set(this.cacheAllData, dataAggregates);
          await this.cacheManager.set(
            this.cacheDataCount,
            dataAggregates.length,
          );
          this.logger.log('Cache Added');
        }

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
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  async getSubscriptionById(id: string, select: string): Promise<ResponsePayload> {
    try {
      const data = await this.subscriptionModel.findById(id).select(select);
      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * updateSubscriptionById
   * updateMultipleSubscriptionById
   */
  async updateSubscriptionById(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.subscriptionModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      await this.subscriptionModel.findByIdAndUpdate(id, {
        $set: updateSubscriptionDto,
      });
      // Cache Removed
      await this.cacheManager.del(this.cacheAllData);
      await this.cacheManager.del(this.cacheDataCount);

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async updateMultipleSubscriptionById(
    ids: string[],
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<ResponsePayload> {
    const mIds = ids.map((m) => new ObjectId(m));

    try {
      await this.subscriptionModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updateSubscriptionDto },
      );

      // Cache Removed
      await this.cacheManager.del(this.cacheAllData);
      await this.cacheManager.del(this.cacheDataCount);

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * deleteSubscriptionById
   * deleteMultipleSubscriptionById
   */
  async deleteSubscriptionById(
    id: string,
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.subscriptionModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    if (data.readOnly) {
      throw new NotFoundException('Sorry! Read only data can not be deleted');
    }
    try {
      await this.subscriptionModel.findByIdAndDelete(id);
      // Cache Removed
      await this.cacheManager.del(this.cacheAllData);
      await this.cacheManager.del(this.cacheDataCount);

      // Reset Product Category Reference
      if (checkUsage) {
        const defaultData = await this.subscriptionModel.findOne({
          readOnly: true,
        });
        const resetData = {
          subscription: {
            _id: defaultData._id,
            name: defaultData.name,
          },
        };
        // Update Deleted Data
        // await this.projectModel.updateMany(
        //   { 'subscription._id': new ObjectId(id) },
        //   { $set: resetData },
        // );
        // await this.taskModel.updateMany(
        //   { 'subscription._id': new ObjectId(id) },
        //   { $set: resetData },
        // );
      }

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleSubscriptionById(
    ids: string[],
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));
      // Remove Read Only Data
      const allData = await this.subscriptionModel.find({ _id: { $in: mIds } });
      const filteredIds = allData
        .filter((f) => f.readOnly !== true)
        .map((m) => m._id);
      await this.subscriptionModel.deleteMany({ _id: filteredIds });
      // Cache Removed
      await this.cacheManager.del(this.cacheAllData);
      await this.cacheManager.del(this.cacheDataCount);

      // Reset Product Category Reference
      if (checkUsage) {
        const defaultData = await this.subscriptionModel.findOne({
          readOnly: true,
        });
        const resetData = {
          subscription: {
            _id: defaultData._id,
            name: defaultData.name,
          },
        };

        // Update Product
        // await this.projectModel.updateMany(
        //   { 'subscription._id': { $in: mIds } },
        //   { $set: resetData },
        // );
        // await this.taskModel.updateMany(
        //   { 'subscription._id': { $in: mIds } },
        //   { $set: resetData },
        // );
      }
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}

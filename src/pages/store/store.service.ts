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
import { Store } from '../../interfaces/store.interface';
import {
  AddStoreDto,
  FilterAndPaginationStoreDto,
  OptionStoreDto,
  UpdateStoreDto,
} from '../../dto/store.dto';
import { Cache } from 'cache-manager';

const ObjectId = Types.ObjectId;

@Injectable()
export class StoreService {
  private logger = new Logger(StoreService.name);
  // Cache
  private readonly cacheAllData = 'getAllStore';
  private readonly cacheDataCount = 'getCountStore';

  constructor(
    @InjectModel('Store')
    private readonly storeModel: Model<Store>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * addStore
   * insertManyStore
   */
  async addStore(addStoreDto: AddStoreDto): Promise<ResponsePayload> {
    const newData = new this.storeModel(addStoreDto);
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

  async insertManyStore(
    addStoresDto: AddStoreDto[],
    optionStoreDto: OptionStoreDto,
  ): Promise<ResponsePayload> {
    const { deleteMany } = optionStoreDto;
    if (deleteMany) {
      await this.storeModel.deleteMany({});
    }
    try {
      const saveData = await this.storeModel.insertMany(addStoresDto);
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
   * getAllStores
   * getStoreById
   */

  async getAllStores(
    filterStoreDto: FilterAndPaginationStoreDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterStoreDto;
    const { pagination } = filterStoreDto;
    const { sort } = filterStoreDto;
    const { select } = filterStoreDto;

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
    const aggregateSstorees = [];
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
      aggregateSstorees.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateSstorees.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateSstorees.push({ $project: mSelect });
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

      aggregateSstorees.push(mPagination);

      aggregateSstorees.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.storeModel.aggregate(aggregateSstorees);
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

  async getStoreById(id: string, select: string): Promise<ResponsePayload> {
    try {
      const data = await this.storeModel.findById(id).select(select);
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
   * updateStoreById
   * updateMultipleStoreById
   */
  async updateStoreById(
    id: string,
    updateStoreDto: UpdateStoreDto,
  ): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.storeModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      await this.storeModel.findByIdAndUpdate(id, {
        $set: updateStoreDto,
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

  async updateMultipleStoreById(
    ids: string[],
    updateStoreDto: UpdateStoreDto,
  ): Promise<ResponsePayload> {
    const mIds = ids.map((m) => new ObjectId(m));

    try {
      await this.storeModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updateStoreDto },
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
   * deleteStoreById
   * deleteMultipleStoreById
   */
  async deleteStoreById(
    id: string,
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.storeModel.findById(id);
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
      await this.storeModel.findByIdAndDelete(id);
      // Cache Removed
      await this.cacheManager.del(this.cacheAllData);
      await this.cacheManager.del(this.cacheDataCount);

      // Reset Product Category Reference
      if (checkUsage) {
        const defaultData = await this.storeModel.findOne({
          readOnly: true,
        });
        const resetData = {
          store: {
            _id: defaultData._id,
            name: defaultData.name,
          },
        };
        // Update Deleted Data
        // await this.projectModel.updateMany(
        //   { 'store._id': new ObjectId(id) },
        //   { $set: resetData },
        // );
        // await this.taskModel.updateMany(
        //   { 'store._id': new ObjectId(id) },
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

  async deleteMultipleStoreById(
    ids: string[],
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));
      // Remove Read Only Data
      const allData = await this.storeModel.find({ _id: { $in: mIds } });
      const filteredIds = allData
        .filter((f) => f.readOnly !== true)
        .map((m) => m._id);
      await this.storeModel.deleteMany({ _id: filteredIds });
      // Cache Removed
      await this.cacheManager.del(this.cacheAllData);
      await this.cacheManager.del(this.cacheDataCount);

      // Reset Product Category Reference
      if (checkUsage) {
        const defaultData = await this.storeModel.findOne({
          readOnly: true,
        });
        const resetData = {
          store: {
            _id: defaultData._id,
            name: defaultData.name,
          },
        };

        // Update Product
        // await this.projectModel.updateMany(
        //   { 'store._id': { $in: mIds } },
        //   { $set: resetData },
        // );
        // await this.taskModel.updateMany(
        //   { 'store._id': { $in: mIds } },
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

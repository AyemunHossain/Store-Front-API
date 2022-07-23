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
import { Promotion } from '../../interfaces/promotion.interface';
import {
  AddPromotionDto,
  FilterAndPaginationPromotionDto,
  OptionPromotionDto,
  UpdatePromotionDto,
} from '../../dto/promotion.dto';
import { Cache } from 'cache-manager';

const ObjectId = Types.ObjectId;

@Injectable()
export class PromotionService {
  private logger = new Logger(PromotionService.name);
  // Cache
  private readonly cacheAllData = 'getAllPromotion';
  private readonly cacheDataCount = 'getCountPromotion';

  constructor(
    @InjectModel('Promotion')
    private readonly promotionModel: Model<Promotion>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * addPromotion
   * insertManyPromotion
   */
  async addPromotion(addPromotionDto: AddPromotionDto): Promise<ResponsePayload> {
    const newData = new this.promotionModel(addPromotionDto);
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

  async insertManyPromotion(
    addPromotionsDto: AddPromotionDto[],
    optionPromotionDto: OptionPromotionDto,
  ): Promise<ResponsePayload> {
    const { deleteMany } = optionPromotionDto;
    if (deleteMany) {
      await this.promotionModel.deleteMany({});
    }
    try {
      const saveData = await this.promotionModel.insertMany(addPromotionsDto);
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
   * getAllPromotions
   * getPromotionById
   */

  async getAllPromotions(
    filterPromotionDto: FilterAndPaginationPromotionDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterPromotionDto;
    const { pagination } = filterPromotionDto;
    const { sort } = filterPromotionDto;
    const { select } = filterPromotionDto;

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
    const aggregateSpromotiones = [];
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
      aggregateSpromotiones.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateSpromotiones.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateSpromotiones.push({ $project: mSelect });
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

      aggregateSpromotiones.push(mPagination);

      aggregateSpromotiones.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.promotionModel.aggregate(aggregateSpromotiones);
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

  async getPromotionById(id: string, select: string): Promise<ResponsePayload> {
    try {
      const data = await this.promotionModel.findById(id).select(select);
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
   * updatePromotionById
   * updateMultiplePromotionById
   */
  async updatePromotionById(
    id: string,
    updatePromotionDto: UpdatePromotionDto,
  ): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.promotionModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      await this.promotionModel.findByIdAndUpdate(id, {
        $set: updatePromotionDto,
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

  async updateMultiplePromotionById(
    ids: string[],
    updatePromotionDto: UpdatePromotionDto,
  ): Promise<ResponsePayload> {
    const mIds = ids.map((m) => new ObjectId(m));

    try {
      await this.promotionModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updatePromotionDto },
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
   * deletePromotionById
   * deleteMultiplePromotionById
   */
  async deletePromotionById(
    id: string,
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.promotionModel.findById(id);
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
      await this.promotionModel.findByIdAndDelete(id);
      // Cache Removed
      await this.cacheManager.del(this.cacheAllData);
      await this.cacheManager.del(this.cacheDataCount);

      // Reset Product Category Reference
      if (checkUsage) {
        const defaultData = await this.promotionModel.findOne({
          readOnly: true,
        });
        const resetData = {
          promotion: {
            _id: defaultData._id,
            name: defaultData.headline,
          },
        };
        // Update Deleted Data
        // await this.projectModel.updateMany(
        //   { 'promotion._id': new ObjectId(id) },
        //   { $set: resetData },
        // );
        // await this.taskModel.updateMany(
        //   { 'promotion._id': new ObjectId(id) },
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

  async deleteMultiplePromotionById(
    ids: string[],
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));
      // Remove Read Only Data
      const allData = await this.promotionModel.find({ _id: { $in: mIds } });
      const filteredIds = allData
        .filter((f) => f.readOnly !== true)
        .map((m) => m._id);
      await this.promotionModel.deleteMany({ _id: filteredIds });
      // Cache Removed
      await this.cacheManager.del(this.cacheAllData);
      await this.cacheManager.del(this.cacheDataCount);

      // Reset Product Category Reference
      if (checkUsage) {
        const defaultData = await this.promotionModel.findOne({
          readOnly: true,
        });
        const resetData = {
          promotion: {
            _id: defaultData._id,
            name: defaultData.headline,
          },
        };

        // Update Product
        // await this.projectModel.updateMany(
        //   { 'promotion._id': { $in: mIds } },
        //   { $set: resetData },
        // );
        // await this.taskModel.updateMany(
        //   { 'promotion._id': { $in: mIds } },
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

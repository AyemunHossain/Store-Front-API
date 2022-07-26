import {
  BadRequestException,
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import {
  Merchant,
  MerchantAuthResponse,
  MerchantJwtPayload,
} from '../../interfaces/merchant.interface';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { ErrorCodes } from '../../enum/error-code.enum';

import { ResponsePayload } from '../../interfaces/response-payload.interface';
import {
  AuthMerchantDto,
  CreateMerchantDto,
  FilterAndPaginationMerchantDto,
  UpdateMerchantDto,
  MerchantSelectFieldDto,
  UpdateMerchantSubscriptionDto,
} from '../../dto/merchant.dto';
import { AdminAuthResponse } from '../../interfaces/admin.interface';
import { ChangePasswordDto } from '../../dto/change-password.dto';
import { Cache } from 'cache-manager';
import { Subscription } from 'src/interfaces/subscription.interface';

const ObjectId = Types.ObjectId;

@Injectable()
export class MerchantService {
  private logger = new Logger(MerchantService.name);
  // Cache
  private readonly cacheAllData = 'getAllMerchant';
  private readonly cacheDataCount = 'getCountMerchant';

  constructor(
    @InjectModel('Merchant') private readonly merchantModel: Model<Merchant>,
    @InjectModel('Subscription') private readonly subscriptionModel: Model<Subscription>,
    protected jwtService: JwtService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  /**
   * Merchant Signup
   * Merchant Login
   * Merchant Signup & Login
   */
  async merchantSignup(createMerchantDto: CreateMerchantDto): Promise<Merchant> {
    const { password } = createMerchantDto;
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(password, salt);

    const mData = { ...createMerchantDto, ...{ password: hashedPass } };
    const newMerchant = new this.merchantModel(mData);

    try {
      const saveData = await newMerchant.save();
      console.log(saveData)
      // Cache Removed
      // await this.cacheManager.del(this.cacheAllData);
      // await this.cacheManager.del(this.cacheDataCount);

      return {
        success: true,
        message: 'Success',
        merchantname: saveData.username,
        name: saveData.name,
        _id: saveData._id,
      } as Merchant;
    } catch (error) {
      // console.log(error);
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        throw new ConflictException('Merchantname already exists');
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async merchantLogin(authMerchantDto: AuthMerchantDto): Promise<MerchantAuthResponse> {
    try {
      const merchant = (await this.merchantModel
        .findOne({ merchantname: authMerchantDto.username })
        .select('password merchantname hasAccess')) as Merchant;

      if (!merchant) {
        return {
          success: false,
          message: 'username is invalid',
        } as MerchantAuthResponse;
      }

      if (!merchant.hasAccess) {
        return {
          success: false,
          message: 'No Access for Login',
        } as AdminAuthResponse;
      }

      const isMatch = await bcrypt.compare(authMerchantDto.password, merchant.password);

      if (isMatch) {
        const payload: MerchantJwtPayload = {
          _id: merchant._id,
          username: merchant.username,
        };
        const accessToken = this.jwtService.sign(payload);
        return {
          success: true,
          message: 'Login success!',
          data: {
            _id: merchant._id,
          },
          token: accessToken,
          tokenExpiredIn: this.configService.get<number>(
            'merchantTokenExpiredTime',
          ),
        } as MerchantAuthResponse;
      } else {
        return {
          success: false,
          message: 'Password not matched!',
          data: null,
          token: null,
          tokenExpiredIn: null,
        } as MerchantAuthResponse;
      }
    } catch (error) {
      console.log(error);
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        throw new ConflictException('Merchantname already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async merchantSignupAndLogin(
    createMerchantDto: CreateMerchantDto,
  ): Promise<MerchantAuthResponse> {
    const { password } = createMerchantDto;
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(password, salt);

    const mData = { ...createMerchantDto, ...{ password: hashedPass } };
    const newMerchant = new this.merchantModel(mData);
    try {
      const saveData = await newMerchant.save();
      const authMerchantDto: AuthMerchantDto = {
        username: saveData.username,
        password: password,
      };
      // Cache Removed
      await this.cacheManager.del(this.cacheAllData);
      await this.cacheManager.del(this.cacheDataCount);

      return this.merchantLogin(authMerchantDto);
    } catch (error) {
      // console.log(error);
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        throw new ConflictException('Merchantname already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * Logged-in Merchant Info
   * Get All Merchants (Not Recommended)
   * Get All Merchants V3 (Filter, Pagination, Select, Sort, Search Query with Aggregation) ** Recommended
   * Get All Merchants by Search
   */
  async getLoggedInMerchantData(
    merchant: Merchant,
    selectQuery: MerchantSelectFieldDto,
  ): Promise<ResponsePayload> {
    try {
      let { select } = selectQuery;
      if (!select) {
        select = '-password';
      }
      const data = await this.merchantModel.findById(merchant._id).select(select);
      return {
        data,
        success: true,
      } as ResponsePayload;
    } catch (err) {
      this.logger.error(`${merchant.username} is failed to retrieve data`);
      // console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async getAllMerchants(
    filterMerchantDto: FilterAndPaginationMerchantDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {

    const { filter } = filterMerchantDto;
    const { pagination } = filterMerchantDto;
    const { sort } = filterMerchantDto;
    const { select } = filterMerchantDto;
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

    // Modify Id as Object ID
    if (filter && filter['designation._id']) {
      filter['designation._id'] = new ObjectId(filter['designation._id']);
    }

    if (filter && filter['merchantType._id']) {
      filter['merchantType._id'] = new ObjectId(filter['merchantType._id']);
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
              { merchantname: { $regex: searchQuery, $options: 'i' } },
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
      const dataAggregates = await this.merchantModel.aggregate(aggregateStages);
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
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * Get Merchant by ID
   * Update Merchant by Id
   * Delete Merchant by Id
   */

  async getMerchantById(
    id: string,
    merchantSelectFieldDto: MerchantSelectFieldDto,
  ): Promise<ResponsePayload> {
    try {
      let { select } = merchantSelectFieldDto;
      if (!select) {
        select = '-password';
      }
      const data = await this.merchantModel.findById(id).select(select);
      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async updateLoggedInMerchantInfo(
    merchants: Merchant,
    updateMerchantDto: UpdateMerchantDto,
  ): Promise<ResponsePayload> {
    const { password, username } = updateMerchantDto;
    let merchant;
    try {
      merchant = await this.merchantModel.findById(merchants._id);
    } catch (err) {
      throw new InternalServerErrorException();
    }
    if (!merchant) {
      throw new NotFoundException('No Merchant found!');
    }
    try {
      // Check Merchantname
      if (username) {
        const isExists = await this.merchantModel.findOne({ username });
        if (isExists) {
          return {
            success: false,
            message: 'Merchantname already exists',
          } as ResponsePayload;
        }
      }

      // Cache Removed
      await this.cacheManager.del(this.cacheAllData);
      await this.cacheManager.del(this.cacheDataCount);

      // Check Password
      if (password) {
        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(password, salt);
        await this.merchantModel.findByIdAndUpdate(merchants._id, {
          $set: { ...updateMerchantDto, ...{ password: hashedPass } },
        });
        return {
          success: true,
          message: 'Data & Password changed success',
        } as ResponsePayload;
      }
      await this.merchantModel.findByIdAndUpdate(merchants._id, {
        $set: updateMerchantDto,
      });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }


  async updateLoggedInMerchantSubscription(
    merchants: Merchant,
    updateMerchantSubscriptionDto: UpdateMerchantSubscriptionDto,
  ): Promise<ResponsePayload> {

    const { subscriptionPlan } = updateMerchantSubscriptionDto;

    const merchant = await this.merchantModel.findOne()

    const subsPlan = await this.subscriptionModel.findById(subscriptionPlan)

    try {

      await this.merchantModel.findByIdAndUpdate(merchant._id, {
        $set: { subscriptionPlan: updateMerchantSubscriptionDto.subscriptionPlan, subscriptionStartedAt: new Date(), subscriptionEndAt: new Date(+new Date() + (subsPlan.days) * 24 * 60 * 60 * 1000) },
      });

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }



  async changeLoggedInMerchantPassword(
    merchants: Merchant,
    changePasswordDto: ChangePasswordDto,
  ): Promise<ResponsePayload> {
    const { password, oldPassword } = changePasswordDto;
    let merchant;
    try {
      merchant = await this.merchantModel.findById(merchants._id).select('password');
    } catch (err) {
      throw new InternalServerErrorException();
    }
    if (!merchant) {
      throw new NotFoundException('No Merchant found!');
    }
    try {
      // Check Old Password
      const isMatch = await bcrypt.compare(oldPassword, merchant.password);

      // Change Password
      if (isMatch) {
        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(password, salt);
        await this.merchantModel.findByIdAndUpdate(merchants._id, {
          $set: { password: hashedPass },
        });
        return {
          success: true,
          message: 'Password changed success',
        } as ResponsePayload;
      } else {
        return {
          success: false,
          message: 'Old password is incorrect!',
        } as ResponsePayload;
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async updateMerchantById(
    id: string,
    updateMerchantDto: UpdateMerchantDto,
  ): Promise<ResponsePayload> {
    const { newPassword, username } = updateMerchantDto;
    let merchant;
    try {
      merchant = await this.merchantModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException();
    }
    if (!merchant) {
      throw new NotFoundException('No merchant found!');
    }
    try {
      // Check Merchantname
      if (username) {
        if (merchant.merchantname !== username) {
          const isExists = await this.merchantModel.findOne({ username });
          if (isExists) {
            return {
              success: false,
              message: 'Merchantname already exists',
            } as ResponsePayload;
          }
        }
      }
      // Cache Removed
      await this.cacheManager.del(this.cacheAllData);
      await this.cacheManager.del(this.cacheDataCount);

      // Check Password
      if (newPassword) {
        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(newPassword, salt);
        await this.merchantModel.findByIdAndUpdate(id, {
          $set: { ...updateMerchantDto, ...{ password: hashedPass } },
        });
        return {
          success: true,
          message: 'Data & Password changed success',
        } as ResponsePayload;
      }
      // Delete No Action Data
      delete updateMerchantDto.password;
      await this.merchantModel.findByIdAndUpdate(id, {
        $set: updateMerchantDto,
      });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async deleteMerchantById(id: string): Promise<ResponsePayload> {
    let merchant;
    try {
      merchant = await this.merchantModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException();
    }
    if (!merchant) {
      throw new NotFoundException('No Merchant found!');
    }
    try {
      await this.merchantModel.findByIdAndDelete(id);
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

  async deleteMultipleMerchantById(
    ids: string[],
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));
      await this.merchantModel.deleteMany({ _id: mIds });
      // Cache Removed
      await this.cacheManager.del(this.cacheAllData);
      await this.cacheManager.del(this.cacheDataCount);

      // Reset Product Category Reference
      // if (checkUsage) {
      //   const defaultData = await this.taskModel.findOne({
      //     readOnly: true,
      //   });
      //   const resetData = {
      //     task: {
      //       _id: defaultData._id,
      //       name: defaultData.name,
      //     },
      //   };
      //
      //   // Update Product
      //   await this.merchantModel.updateMany(
      //     { 'task._id': { $in: mIds } },
      //     { $set: resetData },
      //   );
      // }
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}

import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from './pagination.dto';

export class AddCarDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  carName: string;

  @IsOptional()
  @IsNumber()
  seatingCapacity: number;

  @IsOptional()
  @IsNumber()
  engineCapacity: number;

  @IsOptional()
  @IsNumber()
  carMileage: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  mileage: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  topSpeed: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  maxPower: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  acceleration: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  width: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  height: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  numOfDoors: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  featured: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  noOfViews: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  noOfGear: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  transmissionType: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  carStatus: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  chassisNo: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  engineNo: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  grade: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  sellOption: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  soldPrice: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  registrationYear: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  expiredOn: string;

  @IsOptional()
  exteriorColor: any;

  @IsOptional()
  interiorColor: any;

  @IsOptional()
  carBackLight: any;

  @IsOptional()
  carBodyType: any;

  @IsOptional()
  carBrake: any;

  @IsOptional()
  carEngine: any;

  @IsOptional()
  @IsArray()
  carFeatures: any[];

  @IsOptional()
  carFuel: any;

  @IsOptional()
  carHeadLight: any;

  @IsOptional()
  carLocation: any;

  @IsOptional()
  carManufacturer: any;

  @IsOptional()
  carSeats: any;

  @IsOptional()
  carSuspension: any;

  @IsOptional()
  carType: any;

  @IsOptional()
  user: any;

  @IsOptional()
  modelName: any;

  @IsOptional()
  wheelType: any;

  @IsOptional()
  @IsNotEmpty()
  isFeatured: boolean;

  @IsOptional()
  @IsNotEmpty()
  isActive: boolean;

  @IsOptional()
  @IsNotEmpty()
  modelCar: boolean;

  @IsOptional()
  @IsNumber()
  fixedPrice: number;

  @IsOptional()
  @IsNumber()
  priceTo: number;

  @IsOptional()
  @IsNumber()
  priceFrom: number;

  @IsOptional()
  @IsArray()
  images: string[];

  @IsOptional()
  @IsString()
  videoLink: string;

  @IsOptional()
  @IsString()
  drive: string;

  @IsOptional()
  @IsBoolean()
  success: boolean;

  @IsOptional()
  carCity: any
}

export class FilterCarDto {



  @IsOptional()
  @IsString()
  carName: string;
}

export class OptionCarDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdateCarDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  ids: string[];

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  carName: string;

  @IsOptional()
  @IsNumber()
  seatingCapacity: number;

  @IsOptional()
  @IsNumber()
  engineCapacity: number;

  @IsOptional()
  @IsNumber()
  carMileage: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  mileage: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  topSpeed: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  maxPower: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  acceleration: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  width: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  height: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  numOfDoors: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  featured: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  noOfViews: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  noOfGear: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  transmissionType: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  carStatus: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  chassisNo: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  engineNo: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  grade: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  sellOption: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  soldPrice: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  registrationYear: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  expiredOn: string;

  @IsOptional()
  exteriorColor: any;

  @IsOptional()
  interiorColor: any;

  @IsOptional()
  carBackLight: any;

  @IsOptional()
  carBodyType: any;

  @IsOptional()
  carBrake: any;

  @IsOptional()
  carEngine: any;

  @IsOptional()
  @IsArray()
  carFeatures: any[];

  @IsOptional()
  carFuel: any;

  @IsOptional()
  carHeadLight: any;

  @IsOptional()
  carLocation: any;

  @IsOptional()
  carManufacturer: any;

  @IsOptional()
  carSeats: any;

  @IsOptional()
  carSuspension: any;

  @IsOptional()
  carType: any;

  @IsOptional()
  user: any;

  @IsOptional()
  modelName: any;

  @IsOptional()
  wheelType: any;

  @IsOptional()
  @IsNotEmpty()
  isFeatured: boolean;

  @IsOptional()
  @IsNotEmpty()
  isActive: boolean;

  @IsOptional()
  @IsNotEmpty()
  modelCar: boolean;

  @IsOptional()
  @IsNumber()
  fixedPrice: number;

  @IsOptional()
  @IsNumber()
  priceTo: number;

  @IsOptional()
  @IsNumber()
  priceFrom: number;

  @IsOptional()
  @IsArray()
  images: string[];

  @IsOptional()
  @IsString()
  videoLink: string;

  @IsOptional()
  @IsString()
  drive: string;

  @IsOptional()
  @IsBoolean()
  success: boolean;

  @IsOptional()
  carCity: any
}

export class FilterAndPaginationCarDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterCarDto)
  filter: FilterCarDto;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination: PaginationDto;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  sort: object;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  select: any;
}
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

export class AddProductDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  Name: string;

  @IsOptional()
  admin: any;

  @IsOptional()
  user:any;

  @IsOptional()
  merchant: any;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  productType: string;

  @IsOptional()
  @IsNumber()
  seatingCapacity: number;

  @IsOptional()
  @IsNumber()
  engineCapacity: number;

  @IsOptional()
  @IsNumber()
  Mileage: number;

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
  Status: string;

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
  BackLight: any;

  @IsOptional()
  BodyType: any;

  @IsOptional()
  Brake: any;

  @IsOptional()
  Engine: any;

  @IsOptional()
  @IsArray()
  Features: any[];

  @IsOptional()
  Fuel: any;

  @IsOptional()
  HeadLight: any;

  @IsOptional()
  Location: any;

  @IsOptional()
  Manufacturer: any;

  @IsOptional()
  Seats: any;

  @IsOptional()
  Suspension: any;

  @IsOptional()
  Type: any;

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
  modelProduct: boolean;

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
  City: any
}

export class FilterProductDto {



  @IsOptional()
  @IsString()
  Name: string;
}

export class OptionProductDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdateProductDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  ids: string[];

  @IsOptional()
  admin: any;

  @IsOptional()
  user:any;

  @IsOptional()
  merchant: any;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  productType: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  Name: string;

  @IsOptional()
  @IsNumber()
  seatingCapacity: number;

  @IsOptional()
  @IsNumber()
  engineCapacity: number;

  @IsOptional()
  @IsNumber()
  Mileage: number;

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
  Status: string;

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
  BackLight: any;

  @IsOptional()
  BodyType: any;

  @IsOptional()
  Brake: any;

  @IsOptional()
  Engine: any;

  @IsOptional()
  @IsArray()
  Features: any[];

  @IsOptional()
  Fuel: any;

  @IsOptional()
  HeadLight: any;

  @IsOptional()
  Location: any;

  @IsOptional()
  Manufacturer: any;

  @IsOptional()
  Seats: any;

  @IsOptional()
  Suspension: any;

  @IsOptional()
  Type: any;
  
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
  modelProduct: boolean;

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
  City: any
}

export class FilterAndPaginationProductDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterProductDto)
  filter: FilterProductDto;

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
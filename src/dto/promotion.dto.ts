import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from './pagination.dto';

export class AddPromotionDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class FilterPromotionDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  headline: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  createdBy: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  startAt: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  endAt: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  imageUrl: string
}

export class OptionPromotionDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdatePromotionDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  headline: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  createdBy: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  startAt: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  endAt: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  imageUrl: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  ids: string[];
}

export class FilterAndPaginationPromotionDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterPromotionDto)
  filter: FilterPromotionDto;

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

import {
  IsDecimal,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class NewFarmDto {
  @IsInt()
  @IsNotEmpty()
  farmerId: number;

  @IsInt()
  @IsNotEmpty()
  soilId: number;

  @IsInt()
  @IsNotEmpty()
  farmT_id: number;

  @IsInt()
  @IsNotEmpty()
  ents_id: number;

  @IsNotEmpty()
  @IsNumber()
  size: number;

  @IsString()
  @IsNotEmpty()
  farm_name: string;

  @IsString()
  @IsNotEmpty()
  farm_location: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  latitude: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  longitude: string;
}

import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class FarmTypeDto {
  @IsEmail()
  @IsNotEmpty()
  type_name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

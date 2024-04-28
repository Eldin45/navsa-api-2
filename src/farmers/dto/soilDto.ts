import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class NewSoilDto {
  @IsEmail()
  @IsNotEmpty()
  soil_name: string;

  @IsString()
  @IsNotEmpty()
  soil_description: string;
}

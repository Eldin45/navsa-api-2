import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class FarmersFundDto {
  @IsString()
  @IsNotEmpty()
  f_phone: string;

  @IsEmail()
  @IsNotEmpty()
  cooperate_email: string;

  @IsString()
  @IsNotEmpty()
  apiKey: string;
}

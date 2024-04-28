import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class NewSupplierDto {
  @IsInt()
  @IsOptional()
  cooperate: number;

  @IsString()
  @IsNotEmpty()
  rep_name: string;

  @IsString()
  @IsNotEmpty()
  rep_email: string;

  @IsString()
  @IsNotEmpty()
  rep_phone: string;

  @IsString()
  @IsNotEmpty()
  company_name: string;

  @IsString()
  @IsNotEmpty()
  company_location: string;

  @IsString()
  @IsNotEmpty()
  company_address: string;

  @IsString()
  @IsNotEmpty()
  cac: string;

  @IsString()
  @IsNotEmpty()
  hash: string;
}

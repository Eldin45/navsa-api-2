import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CooperateWalletDto {
  @IsInt()
  @IsNotEmpty()
  cooperateId: number;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  requestId: string;

  @IsString()
  @IsNotEmpty()
  account_name: string;

  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsString()
  @IsNotEmpty()
  bank_code: string;
}

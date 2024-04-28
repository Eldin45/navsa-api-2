import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SingleTransfertDto {
  @IsInt()
  @IsNotEmpty()
  toBank: string;

  @IsString()
  @IsNotEmpty()
  creditAccount: string;

  @IsString()
  @IsNotEmpty()
  narration: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  transRef: string;

  @IsString()
  @IsNotEmpty()
  fromBank: string;

  @IsString()
  @IsNotEmpty()
  debitAccount: string;

  @IsEmail()
  @IsNotEmpty()
  beneficiaryemail: string;

  @IsString()
  @IsNotEmpty()
  requestId: string;
}

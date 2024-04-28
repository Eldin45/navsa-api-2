import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class NewDashDto {
  @IsInt()
  @IsOptional()
  dashId: number;

  @IsString()
  @IsNotEmpty()
  rep_fullname: string;

  @IsString()
  @IsNotEmpty()
  rep_phone: string;

  @IsString()
  @IsNotEmpty()
  cooperate_name: string;

  @IsEmail()
  @IsNotEmpty()
  cooperate_email: string;

  @IsString()
  @IsNotEmpty()
  previllage: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  privateKey: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  publicKey: string;
  @IsString()
  @IsNotEmpty()
  hash: string;
}

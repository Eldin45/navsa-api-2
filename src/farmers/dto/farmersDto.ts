import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class NewFarmersDto {
  @IsInt()
  @IsNotEmpty()
  f_cooperate: number;

  @IsInt()
  @IsNotEmpty()
  agentId: number;

  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  other_name: string;

  @IsEmail()
  @IsNotEmpty()
  f_email: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  f_phone: string;

  @IsString()
  @IsNotEmpty()
  f_gendar: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  f_dob: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  f_qualification: string;

  @IsInt()
  @IsNotEmpty()
  zoneId: number;

  @IsInt()
  @IsNotEmpty()
  stateId: number;

  @IsString()
  @IsNotEmpty()
  hash: string;
}

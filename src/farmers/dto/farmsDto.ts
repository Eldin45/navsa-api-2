import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class NewFarmersDto {
  @IsInt()
  @IsNotEmpty()
  f_cooperate: number;

  @IsInt()
  @IsNotEmpty()
  agentId: number;

  @IsEmail()
  @IsNotEmpty()
  surname: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  other_name: string;

  @IsString()
  @IsNotEmpty()
  f_email: string;

  @IsString()
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
  f_qualificatio: string;

  @IsInt()
  @IsNotEmpty()
  zoneId: number;

  @IsInt()
  @IsNotEmpty()
  stateId: number;

  @IsInt()
  @IsNotEmpty()
  localId: number;

  @IsString()
  @IsNotEmpty()
  hash: string;
}

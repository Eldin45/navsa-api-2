import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class NewZoneDto {
  @IsEmail()
  @IsNotEmpty()
  zone: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

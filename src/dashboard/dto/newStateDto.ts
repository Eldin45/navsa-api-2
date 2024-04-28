import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class NewStateDto {
  @IsEmail()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

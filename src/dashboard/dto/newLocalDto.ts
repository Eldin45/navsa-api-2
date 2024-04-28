import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class NewLocalDto {
  @IsEmail()
  @IsNotEmpty()
  name: string;
}

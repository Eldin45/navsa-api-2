import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class FarmersLogDto {
  @IsString()
  @IsNotEmpty()
  f_phone: string;

  @IsString()
  @IsNotEmpty()
  hash: string;
}

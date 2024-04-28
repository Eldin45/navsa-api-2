import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class SupplierLogDto {
  @IsEmail()
  @IsNotEmpty()
  rep_email: string;

  @IsString()
  @IsNotEmpty()
  hash: string;
}

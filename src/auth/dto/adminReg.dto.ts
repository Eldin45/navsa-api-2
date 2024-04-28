import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class AdminRegDto {
  @IsString()
  @IsNotEmpty()
  admin_name: string;

  @IsString()
  @IsNotEmpty()
  organisation: string;

  @IsEmail()
  @IsNotEmpty()
  admin_email: string;

  @IsString()
  @IsNotEmpty()
  admin_phone: string;

  @IsString()
  @IsNotEmpty()
  previllage: string;
  @IsString()
  @IsNotEmpty()
  hash: string;
}

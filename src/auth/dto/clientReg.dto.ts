import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ClientRegDto {
  @IsString()
  @IsNotEmpty()
  company_name: string;

  @IsEmail()
  @IsNotEmpty()
  company_email: string;

  @IsString()
  @IsNotEmpty()
  company_phone: string;

  @IsString()
  @IsNotEmpty()
  company_cac: string;
  @IsString()
  @IsNotEmpty()
  hash: string;
}

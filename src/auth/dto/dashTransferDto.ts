import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class DashTransDto {
  @IsEmail()
  @IsNotEmpty()
  admin_email: string;

  @IsString()
  @IsNotEmpty()
  hash: string;
}

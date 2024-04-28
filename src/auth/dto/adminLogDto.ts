import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class adminLogDto {
  @IsEmail()
  @IsNotEmpty()
  admin_email: string;

  @IsString()
  @IsNotEmpty()
  hash: string;
}

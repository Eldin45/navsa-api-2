import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class DashLogDto {
  @IsEmail()
  @IsNotEmpty()
  cooperate_email: string;

  @IsString()
  @IsNotEmpty()
  hash: string;
}

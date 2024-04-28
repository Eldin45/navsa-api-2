import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ChangePassDto {
  @IsString()
  @IsNotEmpty()
  old_password: string;

  @IsString()
  @IsNotEmpty()
  new_password: string;
}

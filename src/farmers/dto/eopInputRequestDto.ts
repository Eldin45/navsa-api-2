import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InputRequestDto {
  @IsString()
  @IsOptional()
  f_phone: string;

  @IsInt()
  @IsNotEmpty()
  eopInt_id: number;
}

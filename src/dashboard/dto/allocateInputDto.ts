import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class AllocatedInputDto {
  @IsInt()
  @IsNotEmpty()
  farmID: number;

  @IsInt()
  @IsNotEmpty()
  inputId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  unit: string;
}

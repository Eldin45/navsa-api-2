import { StdioNull } from 'child_process';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class NewInputsDto {
  @IsString()
  @IsNotEmpty()
  input_name: string;

  @IsNumber()
  @IsNotEmpty()
  input_unit: string;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  price: number;
}

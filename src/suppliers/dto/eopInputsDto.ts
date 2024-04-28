import { StdioNull } from 'child_process';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class NewEopInputsDto {
  @IsInt()
  @IsNotEmpty()
  inputId: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  assigned_price: number;

  @IsInt()
  @IsNotEmpty()
  eop_id: number;

  @IsInt()
  @IsOptional()
  supplierId: number;
}

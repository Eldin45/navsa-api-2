import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PinSettingsDto {
  @IsInt()
  @IsOptional()
  supplierId: number;

  @IsNotEmpty()
  @IsString()
  transactionPin: string;
}

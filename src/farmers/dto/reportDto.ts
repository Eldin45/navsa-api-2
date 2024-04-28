import { StdioNull } from 'child_process';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class NewReportDto {
  @IsInt()
  @IsNotEmpty()
  farmId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  report_data: string;
}

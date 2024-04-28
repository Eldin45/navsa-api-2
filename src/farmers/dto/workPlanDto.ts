import { StdioNull } from 'child_process';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class NewWorkPlanDto {
  @IsInt()
  @IsNotEmpty()
  farmId: number;

  @IsString()
  @IsNotEmpty()
  plan: string;

  @IsString()
  @IsNotEmpty()
  plan_description: string;
}

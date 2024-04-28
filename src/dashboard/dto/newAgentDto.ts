import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class NewAgentDto {
  @IsString()
  @IsNotEmpty()
  agent_fullname: string;

  @IsString()
  @IsNotEmpty()
  agent_phone: string;

  @IsString()
  @IsNotEmpty()
  agent_email: string;

  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  cooperate: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  privateKey: string;

  @IsString()
  @IsNotEmpty()
  hash: string;
}

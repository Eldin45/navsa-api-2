import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class AgentLogDto {
  @IsEmail()
  @IsNotEmpty()
  agent_email: string;

  @IsString()
  @IsNotEmpty()
  hash: string;
}

import { IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';

import { Role } from '../entities/user.entity';

export class CreateUserDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(Role)
  role: Role;
}

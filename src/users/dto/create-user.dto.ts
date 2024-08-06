import { IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';

import { Role } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNumber()
  id: number;

  @IsString()
  @ApiProperty({ example: 'Jose', description: 'Name of the user' })
  name: string;

  @IsEmail()
  @ApiProperty({ example: 'email@asdf.com', description: 'Email of the user' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'asdf1234', description: 'Password of the user' })
  password: string;

  @IsEnum(Role)
  @ApiProperty({ example: Role.CUSTOMER, description: 'Role of the user' })
  role: Role;
}

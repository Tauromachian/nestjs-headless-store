import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class ResponseUserDto extends CreateUserDto {
  @ApiProperty({
    description: 'The ID of the user where that owns the category.',
    example: 1,
  })
  id: number;
}

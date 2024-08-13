import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({
    description: 'The ID of the user where that owns the cart.',
    example: 1,
  })
  @IsNotEmpty()
  userId: number;
}

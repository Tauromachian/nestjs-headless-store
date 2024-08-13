import { ApiProperty } from '@nestjs/swagger';

import { CreateCartDto } from './create-cart.dto';

export class ResponseCartDto extends CreateCartDto {
  @ApiProperty({
    description: 'The ID of the user where that owns the cart.',
    example: 1,
  })
  id: number;
}

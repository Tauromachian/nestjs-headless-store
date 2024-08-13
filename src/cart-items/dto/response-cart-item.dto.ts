import { ApiProperty } from '@nestjs/swagger';

import { CreateCartItemDto } from './create-cart-item.dto';

export class ResponseCartItemDto extends CreateCartItemDto {
  @ApiProperty({
    description: 'The ID of the user where that owns the cart.',
    example: 1,
  })
  id: number;
}

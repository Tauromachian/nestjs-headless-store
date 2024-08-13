import { IsNotEmpty, IsNumber } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { Cart } from 'src/carts/entities/cart.entity';
import { Item } from 'src/items/entities/item.entity';

import { IsInDatabase } from 'src/custom-validators/IsInDatabase';

export class CreateCartItemDto {
  @ApiProperty({
    description: 'The quantity of the item to be added to the cart',
    example: 2,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'The ID of the cart where the item will be added',
    example: 1,
  })
  @IsNotEmpty()
  @IsInDatabase(Cart, 'id')
  cartId: number;

  @ApiProperty({
    description: 'The ID of the item to be added to the cart',
    example: 3,
  })
  @IsNotEmpty()
  @IsInDatabase(Item, 'id')
  itemId: number;
}

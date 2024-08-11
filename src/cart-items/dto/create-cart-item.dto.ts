import { IsNumber } from 'class-validator';

import { Cart } from 'src/carts/entities/cart.entity';
import { Item } from 'src/items/entities/item.entity';

import { IsInDatabase } from 'src/custom-validators/IsInDatabase';

export class CreateCartItemDto {
  @IsNumber()
  quantity: number;

  @IsInDatabase(Cart, 'id')
  cartId: string;

  @IsInDatabase(Item, 'id')
  itemId: string;
}

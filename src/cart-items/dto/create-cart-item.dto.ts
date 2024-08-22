import { IsNotEmpty } from 'class-validator';

import { Cart } from 'src/carts/entities/cart.entity';
import { Item } from 'src/items/entities/item.entity';

import { IsInDatabase } from 'src/custom-validators/IsInDatabase';

export class CreateCartItemDto {
  @IsNotEmpty()
  @IsInDatabase(Cart, 'id')
  cartId: number;

  @IsNotEmpty()
  @IsInDatabase(Item, 'id')
  itemId: number;
}

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Cart } from 'src/carts/entities/cart.entity';
import { Item } from 'src/items/entities/item.entity';

@Entity()
export class CartItem {
  constructor(cartItem: Partial<CartItem>) {
    Object.assign(this, cartItem);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  cart: Cart;

  @ManyToOne(() => Item, (item) => item.cartItems)
  item: Item;
}

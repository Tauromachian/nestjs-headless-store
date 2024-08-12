import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @ManyToOne(() => Cart, (cart) => cart.cartItems, { cascade: ['insert'] })
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @Column()
  cartId: number;

  @ManyToOne(() => Item, (item) => item.cartItems, { cascade: ['insert'] })
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @Column()
  itemId: number;
}
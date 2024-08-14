import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Cart } from 'src/carts/entities/cart.entity';
import { Item } from 'src/items/entities/item.entity';
import { Base } from 'src/shared/entities/base.entity';

@Entity()
export class CartItem extends Base {
  @Column()
  quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @Column()
  cartId: number;

  @ManyToOne(() => Item, (item) => item.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @Column()
  itemId: number;
}

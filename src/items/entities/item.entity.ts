import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';

import { CartItem } from 'src/cart-items/entities/cart-item.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Base } from 'src/shared/entities/base.entity';

@Entity()
export class Item extends Base {
  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  currency: string;

  @Column()
  description: string;

  @ManyToMany(() => Category, (category) => category.items)
  categories: Category[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.item, {
    cascade: ['remove'],
  })
  cartItems: CartItem[];
}

import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CartItem } from 'src/cart-items/entities/cart-item.entity';
import { Category } from 'src/categories/entities/category.entity';

@Entity()
export class Item {
  constructor(item: Partial<Item>) {
    Object.assign(this, item);
  }

  @PrimaryGeneratedColumn()
  id: number;

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

  @OneToMany(() => CartItem, (cartItem) => cartItem.item)
  cartItems: CartItem[];
}

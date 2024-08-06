import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { CartItem } from 'src/cart-items/entities/cart-item.entity';

@Entity()
export class Cart {
  constructor(item: Partial<User>) {
    Object.assign(this, item);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  cartItems: CartItem[];
}

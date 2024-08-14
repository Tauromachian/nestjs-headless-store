import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { CartItem } from 'src/cart-items/entities/cart-item.entity';
import { Base } from 'src/shared/entities/base.entity';

@Entity()
export class Cart extends Base {
  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    cascade: ['remove'],
  })
  cartItems: CartItem[];
}

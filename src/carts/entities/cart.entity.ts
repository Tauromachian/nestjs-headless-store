import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Item } from 'src/items/entities/item.entity';

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

  @ManyToMany(() => Item)
  @JoinTable()
  items: Item[];
}

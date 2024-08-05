import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Item } from 'src/items/entities/item.entity';

@Entity()
export class Category {
  constructor(category: Partial<Category>) {
    Object.assign(this, category);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => Item, (item) => item.categories)
  @JoinTable()
  items: Item;
}

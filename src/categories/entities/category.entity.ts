import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

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

  @ManyToOne(() => Item, (item) => item.categories)
  item: Item;
}

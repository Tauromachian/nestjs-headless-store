import { Column, Entity, ManyToMany, JoinTable } from 'typeorm';

import { Item } from 'src/items/entities/item.entity';
import { Base } from 'src/shared/entities/base.entity';

@Entity()
export class Category extends Base {
  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => Item, (item) => item.categories)
  @JoinTable()
  items: Item;
}

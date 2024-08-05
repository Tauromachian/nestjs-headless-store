import { Category } from 'src/categories/entities/category.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(() => Category, (category) => category.item)
  categories: Category[];
}

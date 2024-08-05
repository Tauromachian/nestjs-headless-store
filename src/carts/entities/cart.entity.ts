import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from 'src/users/entities/user.entity';

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
}

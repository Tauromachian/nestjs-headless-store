import { Base } from 'src/shared/entities/base.entity';
import { Column, Entity } from 'typeorm';

export enum Role {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

@Entity()
export class User extends Base {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CUSTOMER,
  })
  role: Role;
}

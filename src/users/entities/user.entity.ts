import { Cart } from 'src/carts/entities/cart.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { Session } from 'src/session/entities/session.entity';
import { Base } from 'src/shared/entities/base.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

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

  @OneToOne(() => Cart, (cart: Cart) => cart.user)
  cart: Cart;

  @OneToMany(
    () => Notification,
    (notification: Notification) => notification.user,
  )
  notifications: Notification[];

  @OneToMany(() => Session, (session: Session) => session.user)
  sessions: Session[];
}

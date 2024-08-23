import { Base } from 'src/shared/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
  IN_APP = 'in-app',
}

@Entity()
export class Notification extends Base {
  @Column()
  title: string;

  @Column()
  text: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.IN_APP,
  })
  type: NotificationType;

  @Column({ default: false })
  isSent: boolean;

  @Column({ default: false })
  isRead: boolean;

  @ManyToOne(() => User, (user: User) => user.notifications)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;
}

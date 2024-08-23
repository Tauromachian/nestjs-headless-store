import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'The title of the notification',
    example: 'Welcome to our service!',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The text content of the notification',
    example: 'Your account has been successfully created.',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    description: 'The type of notification',
    enum: NotificationType,
    example: NotificationType.EMAIL,
    default: NotificationType.IN_APP,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    description: 'Indicates if the notification has been sent',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isSent?: boolean;

  @ApiProperty({
    description: 'Indicates if the notification has been read by the user',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  @ApiProperty({
    description: 'The ID of the user receiving the notification',
    example: 1,
  })
  @IsNumber()
  userId: number;
}

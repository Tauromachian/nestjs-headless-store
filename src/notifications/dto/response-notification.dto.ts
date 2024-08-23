import { ApiProperty } from '@nestjs/swagger';
import { CreateNotificationDto } from './create-notification.dto';

export class ResponseNotificationDto extends CreateNotificationDto {
  @ApiProperty({
    description: 'The ID of the notification.',
    example: 1,
  })
  id: number;
}

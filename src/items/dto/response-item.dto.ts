import { ApiProperty } from '@nestjs/swagger';
import { CreateItemDto } from './create-item.dto';

export class ResponseItemDto extends CreateItemDto {
  @ApiProperty({
    description: 'The ID of the user where that owns the category.',
    example: 1,
  })
  id: number;
}

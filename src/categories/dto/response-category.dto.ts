import { CreateCategoryDto } from './create-category.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseCategoryDto extends CreateCategoryDto {
  @ApiProperty({
    description: 'The ID of the user where that owns the category.',
    example: 1,
  })
  id: number;
}

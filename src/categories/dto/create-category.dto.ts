import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Electronics',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A brief description of the category',
    example: 'Category for all electronic items',
  })
  @IsString()
  description: string;
}

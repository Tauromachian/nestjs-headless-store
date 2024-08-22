import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ResponseFilterDto<G> {
  @ApiProperty({
    description: 'The total number of items available.',
    example: 100,
  })
  @IsNumber()
  total: number;

  @ApiProperty({
    description: 'The number of items per page.',
    example: 10,
  })
  @IsNumber()
  per_page: number;

  @ApiProperty({
    description: 'The current page number.',
    example: 1,
  })
  @IsNumber()
  current_page: number;

  @ApiProperty({
    description: 'The starting index of the current page items.',
    example: 1,
  })
  @IsNumber()
  from: number;

  @ApiProperty({
    description: 'The ending index of the current page items.',
    example: 10,
  })
  @IsNumber()
  to: number;

  @ApiProperty({
    description: 'The data items for the current page.',
    isArray: true,
  })
  data: G[];
}

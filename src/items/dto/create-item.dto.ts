import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({
    description: 'The name of the item',
    example: 'Laptop',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The price of the item',
    example: 999.99,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'The quantity of the item available',
    example: 10,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'The currency used for the price',
    example: 'USD',
  })
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'A brief description of the item',
    example: 'A high-performance laptop suitable for gaming and work.',
  })
  @IsString()
  description: string;
}

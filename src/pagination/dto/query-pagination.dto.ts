import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class QueryPaginationDto {
  @ApiPropertyOptional({
    description: 'The number of records to return',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 15;

  @ApiPropertyOptional({
    description: 'The page number to retrieve',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;
}

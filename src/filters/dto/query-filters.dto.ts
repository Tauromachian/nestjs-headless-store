import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsObject } from 'class-validator';

import { QueryPaginationDto } from 'src/pagination/dto/query-pagination.dto';

export class QueryFilterDto extends QueryPaginationDto {
  @ApiPropertyOptional()
  @IsArray()
  select?: string[];

  @ApiPropertyOptional()
  @IsObject()
  filter?: { [column: string]: string | string[] };

  @ApiPropertyOptional()
  @IsArray()
  relations?: string[];
}

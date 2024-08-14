import { IsNumber } from 'class-validator';

export class PaginationDto<G> {
  @IsNumber()
  total: number;

  @IsNumber()
  per_page: number;

  @IsNumber()
  current_page: number;

  @IsNumber()
  from: number;

  @IsNumber()
  to: number;

  @IsNumber()
  data: G[];
}

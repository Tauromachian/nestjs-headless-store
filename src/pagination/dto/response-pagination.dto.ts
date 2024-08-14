import { IsNumber } from 'class-validator';

export class ResponsePaginationDto<G> {
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

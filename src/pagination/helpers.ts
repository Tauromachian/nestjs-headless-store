import { Repository } from 'typeorm';
import { QueryPaginationDto } from './dto/query-pagination.dto';
import { ResponsePaginationDto } from './dto/response-pagination.dto';

export async function paginate<G>(
  repository: Repository<G>,
  paginationDto: QueryPaginationDto,
): Promise<ResponsePaginationDto<G>> {
  const queryBuilder = repository.createQueryBuilder();

  const [data, count] = await queryBuilder
    .limit(paginationDto.limit)
    .skip(paginationDto.limit * (paginationDto.page - 1))
    .getManyAndCount();

  return {
    per_page: paginationDto.limit,
    current_page: paginationDto.page,
    from: (paginationDto.page - 1) * paginationDto.limit,
    to: paginationDto.page * paginationDto.limit,
    total: count,
    data: data,
  };
}

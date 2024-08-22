import { Repository, SelectQueryBuilder } from 'typeorm';
import { QueryFilterDto } from './dto/query-filters.dto';
import { ResponseFilterDto } from './dto/response-filters.dto';

export async function filter<G>(
  repository: Repository<G> | SelectQueryBuilder<G>,
  queryDto: QueryFilterDto,
): Promise<ResponseFilterDto<Partial<G>>> {
  const queryBuilder =
    repository instanceof Repository
      ? repository.createQueryBuilder()
      : repository;

  if (queryDto.select) {
    queryBuilder.select(queryDto.select);
  }

  if (queryDto.limit) queryBuilder.limit(queryDto.limit);
  if (queryDto.limit) queryBuilder.skip(queryDto.limit * (queryDto.page - 1));

  let result: [Partial<G>[], number];

  if (queryDto.select) {
    result = await Promise.all([
      queryBuilder.getRawMany(),
      queryBuilder.getCount(),
    ]);
  } else {
    result = await queryBuilder.getManyAndCount();
  }

  const count = result[1];
  const data = result[0];

  return {
    per_page: queryDto.limit,
    current_page: queryDto.page,
    from: (queryDto.page - 1) * queryDto.limit,
    to: queryDto.page * queryDto.limit,
    total: count,
    data: data,
  };
}

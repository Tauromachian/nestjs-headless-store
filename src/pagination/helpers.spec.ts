import { SelectQueryBuilder } from 'typeorm';

import { QueryPaginationDto } from './dto/query-pagination.dto';

import { paginate } from './helpers';

const result = {
  per_page: 1,
  current_page: 1,
  from: 0,
  to: 1,
  total: 1,
  data: [
    {
      id: 1,
      name: 'test1',
      price: 10,
      quantity: 10,
      currency: 'USD',
      description: 'test1',
    },
  ],
};

describe('paginate', () => {
  let mockQueryBuilder: SelectQueryBuilder<any>;

  beforeEach(() => {
    mockQueryBuilder = {
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    } as unknown as SelectQueryBuilder<any>;
  });

  it('should return correct response', async () => {
    (mockQueryBuilder.getManyAndCount as any).mockResolvedValue(result);

    const paginationDto: QueryPaginationDto = {
      limit: 1,
      page: 1,
    };

    jest
      .spyOn(mockQueryBuilder, 'getManyAndCount')
      .mockImplementation(async () => [
        [
          {
            id: 1,
            name: 'test1',
            price: 10,
            quantity: 10,
            currency: 'USD',
            description: 'test1',
          },
        ],
        1,
      ]);

    expect(await paginate(mockQueryBuilder, paginationDto)).toEqual(result);

    expect(mockQueryBuilder.limit).toHaveBeenCalledWith(paginationDto.limit);
  });
});

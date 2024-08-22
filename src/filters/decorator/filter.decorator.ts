import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { QueryFilterDto } from '../dto/query-filters.dto';
import { QueryPaginationDto } from 'src/pagination/dto/query-pagination.dto';
import { paginateDecoratorFunction } from 'src/pagination/decorator/pagination.decorator';

import { formatErrorMessages } from 'src/shared/utils';

export const Filter = createParamDecorator(
  (_, ctx: ExecutionContext): QueryFilterDto => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    if (!query || !Object.keys(query)) return {};

    const paginationDto = paginateDecoratorFunction(null, ctx);

    const filterObject = {
      select:
        query?.select !== undefined ? parseSelectField(query.select) : null,
    };

    const filterQueryDto = plainToInstance(QueryPaginationDto, filterObject);
    const errors = validateSync(filterQueryDto);

    if (errors.length === 0) {
      const queryDto = { ...paginationDto, ...filterQueryDto };
      return queryDto;
    }

    const errorMessages = formatErrorMessages(errors);
    throw new BadRequestException(errorMessages);
  },
);

function parseSelectField(queryStringFragment: string) {
  return queryStringFragment.split(',');
}

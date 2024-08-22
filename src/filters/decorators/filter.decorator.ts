import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { QueryFilterDto } from '../dto/query-filters.dto';
import { QueryPaginationDto } from 'src/pagination/dto/query-pagination.dto';
import { paginateDecoratorFunction } from 'src/pagination/decorators/pagination.decorator';

import { formatErrorsMessages } from 'src/shared/utils';

export const Filter = createParamDecorator(
  (_, ctx: ExecutionContext): QueryFilterDto => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    if (!query || !Object.keys(query)) return {};

    const paginationDto = paginateDecoratorFunction(null, ctx);

    const filterObject = {
      select: query?.select !== undefined ? query.select.split(',') : null,
      relations:
        query.relations !== undefined ? query.relations.split(',') : null,
    };

    const filterQueryDto = plainToInstance(QueryPaginationDto, filterObject);
    const errors = validateSync(filterQueryDto);

    if (errors.length === 0) {
      const queryDto = { ...paginationDto, ...filterQueryDto };
      return queryDto;
    }

    const errorMessages = formatErrorsMessages(errors);
    throw new BadRequestException(errorMessages);
  },
);

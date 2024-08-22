import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { QueryPaginationDto } from '../dto/query-pagination.dto';
import { queryValues } from '../dto/constants';
import { formatErrorsMessages } from 'src/shared/utils';

export const Paginate = createParamDecorator(paginateDecoratorFunction);

export function paginateDecoratorFunction(_: null, ctx: ExecutionContext) {
  const request = ctx.switchToHttp().getRequest();
  const query = request.query;

  if (!Object.keys(query)) return {};

  const paginationObject = {
    limit: query?.limit !== undefined ? +query.limit : queryValues.LIMIT,
    page: query?.page !== undefined ? +query.page : queryValues.PAGE,
  };

  const queryDto = plainToInstance(QueryPaginationDto, paginationObject);
  const errors = validateSync(queryDto);

  const errorMessages = formatErrorsMessages(errors);
  throw new BadRequestException(errorMessages);
}

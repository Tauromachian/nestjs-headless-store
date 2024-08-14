import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { QueryPaginationDto } from '../dto/query-pagination.dto';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { queryValues } from '../dto/constants';

export const Paginate = createParamDecorator(
  (_, ctx: ExecutionContext): QueryPaginationDto => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    if (!Object.keys(query)) return {};

    const paginationObject = {
      limit: query?.limit !== undefined ? +query.limit : queryValues.LIMIT,
      page: query?.page !== undefined ? +query.page : queryValues.PAGE,
    };

    const queryDto = plainToInstance(QueryPaginationDto, paginationObject);
    const errors = validateSync(queryDto);

    if (errors.length === 0) return queryDto;

    if (errors.length === 1) {
      throw new BadRequestException(errors[0].toString());
    }

    const errorMessages = [];
    for (const error of errors) {
      errorMessages.push(error.toString());
    }

    throw new BadRequestException(errorMessages);
  },
);

import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Item } from './entities/item.entity';

import { QueryPaginationDto } from 'src/pagination/dto/query-pagination.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ResponseItemDto } from './dto/response-item.dto';
import { ResponseFilterDto } from 'src/filters/dto/response-filters.dto';

import { filter } from 'src/filters/helpers';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private readonly itemsRepository: Repository<Item>,
  ) {}

  create(createItemDto: CreateItemDto): Promise<ResponseItemDto> {
    const item = this.itemsRepository.create(createItemDto);

    const newItem = this.itemsRepository.save(item);

    return newItem;
  }

  async findAll(
    paginationDto: QueryPaginationDto,
  ): Promise<ResponseFilterDto<Partial<ResponseItemDto>>> {
    return filter(this.itemsRepository, paginationDto);
  }

  async findOne(id: number): Promise<ResponseItemDto> {
    const item = await this.itemsRepository.findOne({ where: { id } });

    if (!item) throw new NotFoundException();

    return item;
  }

  async update(
    id: number,
    updateItemDto: UpdateItemDto,
  ): Promise<ResponseItemDto> {
    const updateResult = await this.itemsRepository.update(id, updateItemDto);

    if (updateResult.affected === 0) throw new NotFoundException();

    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.itemsRepository.delete({ id });

    if (result.affected === 0) throw new NotFoundException();

    return { message: 'Item deleted successfully' };
  }
}

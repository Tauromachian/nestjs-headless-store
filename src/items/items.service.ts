import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryPaginationDto } from 'src/pagination/dto/query-pagination.dto';
import { ResponsePaginationDto } from 'src/pagination/dto/response-pagination.dto';
import { paginate } from 'src/pagination/helpers';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private readonly itemsRepository: Repository<Item>,
  ) {}

  create(createItemDto: CreateItemDto) {
    const item = new Item(createItemDto);

    const newItem = this.itemsRepository.save(item);

    return newItem;
  }

  async findAll(
    paginationDto: QueryPaginationDto,
  ): Promise<ResponsePaginationDto<Item>> {
    return paginate(this.itemsRepository, paginationDto);
  }

  async findOne(id: number) {
    const item = await this.itemsRepository.findOne({ where: { id } });

    if (!item) throw new NotFoundException();

    return item;
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return this.itemsRepository.update(id, updateItemDto);
  }

  async remove(id: number) {
    const result = await this.itemsRepository.delete({ id });

    if (result.affected === 0) throw new NotFoundException();

    return { message: 'Item deleted successfully' };
  }
}

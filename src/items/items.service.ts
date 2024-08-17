import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryPaginationDto } from 'src/pagination/dto/query-pagination.dto';
import { ResponsePaginationDto } from 'src/pagination/dto/response-pagination.dto';
import { paginate } from 'src/pagination/helpers';
import { ResponseItemDto } from './dto/response-item.dto';

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
  ): Promise<ResponsePaginationDto<ResponseItemDto>> {
    return paginate(this.itemsRepository, paginationDto);
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

    const item = await this.itemsRepository.findOneBy({ id });

    if (!item) throw new NotFoundException();

    return item;
  }

  async remove(id: number) {
    const result = await this.itemsRepository.delete({ id });

    if (result.affected === 0) throw new NotFoundException();

    return { message: 'Item deleted successfully' };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryPaginationDto } from 'src/pagination/dto/query-pagination.dto';
import { ResponsePaginationDto } from 'src/pagination/dto/response-pagination.dto';
import { paginate } from 'src/pagination/helpers';
import { ResponseCategoryDto } from './dto/response-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly itemsRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    const item = this.itemsRepository.create(createCategoryDto);

    const newCategory = this.itemsRepository.save(item);

    return newCategory;
  }

  async findAll(
    paginationDto: QueryPaginationDto,
  ): Promise<ResponsePaginationDto<Category>> {
    return paginate(this.itemsRepository, paginationDto);
  }

  async findOne(id: number) {
    const item = await this.itemsRepository.findOne({ where: { id } });

    if (!item) throw new NotFoundException();

    return item;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponseCategoryDto> {
    const updateResult = await this.itemsRepository.update(
      id,
      updateCategoryDto,
    );

    if (updateResult.affected === 0) throw new NotFoundException();

    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.itemsRepository.delete({ id });

    if (result.affected === 0) throw new NotFoundException();

    return { message: 'Category deleted successfully' };
  }
}

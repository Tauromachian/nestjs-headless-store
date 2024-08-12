import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly itemsRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    const item = new Category(createCategoryDto);

    const newCategory = this.itemsRepository.save(item);

    return newCategory;
  }

  async findAll() {
    return this.itemsRepository.find();
  }

  async findOne(id: number) {
    const item = await this.itemsRepository.findOne({ where: { id } });

    if (!item) throw new NotFoundException();

    return item;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.itemsRepository.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    const result = await this.itemsRepository.delete({ id });

    if (result.affected === 0) throw new NotFoundException();

    return { message: 'Category deleted successfully' };
  }
}

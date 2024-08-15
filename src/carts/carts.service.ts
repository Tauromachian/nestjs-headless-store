import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryPaginationDto } from 'src/pagination/dto/query-pagination.dto';
import { ResponsePaginationDto } from 'src/pagination/dto/response-pagination.dto';
import { paginate } from 'src/pagination/helpers';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private readonly cartsRepository: Repository<Cart>,
  ) {}

  create(createCartDto: CreateCartDto) {
    const item = this.cartsRepository.create(createCartDto);

    const newCart = this.cartsRepository.save(item);

    return newCart;
  }

  async findAll(
    paginationDto: QueryPaginationDto,
    include?: string,
  ): Promise<ResponsePaginationDto<Cart>> {
    const queryBuilder = this.cartsRepository.createQueryBuilder();

    if (include) {
      queryBuilder.relation('cartItems').relation('cartItems.item');

      return paginate(queryBuilder, paginationDto);
    }

    return paginate(this.cartsRepository, paginationDto);
  }

  async findOne(id: number) {
    const item = await this.cartsRepository.findOne({ where: { id } });

    if (!item) throw new NotFoundException();

    return item;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return this.cartsRepository.update(id, updateCartDto);
  }

  async remove(id: number) {
    const result = await this.cartsRepository.delete({ id });

    if (result.affected === 0) throw new NotFoundException();

    return { message: 'Cart deleted successfully' };
  }
}

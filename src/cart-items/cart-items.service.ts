import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CreateCartItemDto } from './dto/create-cart-item.dto';

import { CartItem } from './entities/cart-item.entity';
import { QueryPaginationDto } from 'src/pagination/dto/query-pagination.dto';
import { ResponsePaginationDto } from 'src/pagination/dto/response-pagination.dto';
import { paginate } from 'src/pagination/helpers';
import { ResponseCartItemDto } from './dto/response-cart-item.dto';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemsRepository: Repository<CartItem>,
  ) {}

  async create(createCartItemDto: CreateCartItemDto) {
    const cartItem = this.cartItemsRepository.create(createCartItemDto);

    const newCartItem = this.cartItemsRepository.save(cartItem);

    return newCartItem;
  }

  async findAll(
    paginationDto: QueryPaginationDto,
  ): Promise<ResponsePaginationDto<CartItem>> {
    return paginate(this.cartItemsRepository, paginationDto);
  }

  async findOne(id: number) {
    const item = await this.cartItemsRepository.findOne({ where: { id } });

    if (!item) throw new NotFoundException();

    return item;
  }

  async update(
    id: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<ResponseCartItemDto> {
    const updateResult = await this.cartItemsRepository.update(
      id,
      updateCartItemDto,
    );

    if (updateResult.affected === 0) throw new NotFoundException();

    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.cartItemsRepository.delete({ id });

    if (result.affected === 0) throw new NotFoundException();

    return { message: 'CartItem deleted successfully' };
  }
}

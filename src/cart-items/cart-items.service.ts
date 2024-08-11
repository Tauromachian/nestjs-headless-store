import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CreateCartItemDto } from './dto/create-cart-item.dto';

import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemsRepository: Repository<CartItem>,
    private readonly entityManager: EntityManager,
  ) {}

  create(createCartItemDto: CreateCartItemDto) {
    const item = new CartItem(createCartItemDto);

    const newCartItem = this.entityManager.save(item);

    return newCartItem;
  }

  async findAll() {
    return this.cartItemsRepository.find();
  }

  async findOne(id: number) {
    const item = await this.cartItemsRepository.findOne({ where: { id } });

    if (!item) throw new NotFoundException();

    return item;
  }

  update(id: number, updateCartItemDto: UpdateCartItemDto) {
    return this.cartItemsRepository.update(id, updateCartItemDto);
  }

  async remove(id: number) {
    const result = await this.cartItemsRepository.delete({ id });

    if (result.affected === 0) throw new NotFoundException();

    return { message: 'CartItem deleted successfully' };
  }
}

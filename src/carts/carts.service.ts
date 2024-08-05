import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

import { Cart } from './entities/cart.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private readonly itemsRepository: Repository<Cart>,
    private readonly entityManager: EntityManager,
  ) {}

  create(createCartDto: CreateCartDto) {
    const item = new Cart(createCartDto);

    const newCart = this.entityManager.save(item);

    return newCart;
  }

  async findAll() {
    return this.itemsRepository.find();
  }

  async findOne(id: number) {
    const item = await this.itemsRepository.findOne({ where: { id } });

    if (!item) throw new NotFoundException();

    return item;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return this.itemsRepository.update(id, updateCartDto);
  }

  async remove(id: number) {
    const result = await this.itemsRepository.delete({ id });

    if (result.affected === 0) throw new NotFoundException();

    return { message: 'Cart deleted successfully' };
  }
}

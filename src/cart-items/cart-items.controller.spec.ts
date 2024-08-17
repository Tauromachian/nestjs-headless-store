import { Test, TestingModule } from '@nestjs/testing';
import { CartItemsController } from './cart-items.controller';
import { CartItemsService } from './cart-items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';

describe('CartItemsController', () => {
  let controller: CartItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartItemsController],
      providers: [
        CartItemsService,
        { provide: getRepositoryToken(CartItem), useClass: Repository },
      ],
    }).compile();

    controller = module.get<CartItemsController>(CartItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

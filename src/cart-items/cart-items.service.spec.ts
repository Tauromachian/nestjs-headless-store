import { Test, TestingModule } from '@nestjs/testing';
import { CartItemsService } from './cart-items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Repository } from 'typeorm';

describe('CartItemsService', () => {
  let service: CartItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartItemsService,
        { provide: getRepositoryToken(CartItem), useClass: Repository },
      ],
    }).compile();

    service = module.get<CartItemsService>(CartItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

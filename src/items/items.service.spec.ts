import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';

describe('ItemsService', () => {
  let service: ItemsService;
  let itemsRepository: Repository<Item>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        { provide: getRepositoryToken(Item), useClass: Repository },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    itemsRepository = module.get<Repository<Item>>(getRepositoryToken(Item));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an item', async () => {
      const item = {
        id: 1,
        categories: [],
        cartItems: [],
        createdAt: new Date(),
        updatedAt: new Date(),

        name: 'Test item',
        currency: 'USD',
        quantity: 1,
        description: 'Test description',
        price: 100,
      };

      jest.spyOn(itemsRepository, 'create').mockReturnValue(item);
      jest.spyOn(itemsRepository, 'save').mockResolvedValue(item);

      const createdItem = await service.create(item);
      expect(createdItem).toEqual(item);
    });
  });
});

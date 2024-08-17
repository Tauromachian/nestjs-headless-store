import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

import { ResponsePaginationDto } from 'src/pagination/dto/response-pagination.dto';
import { QueryPaginationDto } from 'src/pagination/dto/query-pagination.dto';
import { ResponseItemDto } from './dto/response-item.dto';
import { CreateItemDto } from './dto/create-item.dto';

import { Item } from './entities/item.entity';

describe('ItemsController', () => {
  let controller: ItemsController;
  let service: ItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [
        ItemsService,
        { provide: getRepositoryToken(Item), useClass: Repository },
      ],
    }).compile();

    controller = module.get<ItemsController>(ItemsController);
    service = module.get<ItemsService>(ItemsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('Should create a new item', async () => {
      const createItemDto: CreateItemDto = {
        name: 'test1',
        price: 10,
        quantity: 10,
        currency: 'USD',
        description: 'test1',
      };

      const result: ResponseItemDto = {
        id: 1,
        name: 'test1',
        price: 10,
        quantity: 10,
        currency: 'USD',
        description: 'test1',
      };

      jest.spyOn(service, 'create').mockImplementation(async () => result);

      expect(await controller.create(createItemDto)).toBe(result);
    });
  });

  describe('findAll', () => {
    it('Should return and array of paginated items', async () => {
      const paginationRequest: QueryPaginationDto = {
        limit: 15,
        page: 1,
      };

      const result: ResponsePaginationDto<ResponseItemDto> = {
        total: 2,
        per_page: 10,
        current_page: 1,
        from: 1,
        to: 10,
        data: [
          {
            id: 1,
            name: 'test1',
            price: 10,
            quantity: 10,
            currency: 'USD',
            description: 'test1',
          },
        ],
      };

      jest.spyOn(service, 'findAll').mockImplementation(async () => result);

      expect(await controller.findAll(paginationRequest)).toBe(result);
    });

    describe('findOne', () => {
      it('Should return one item correctly', async () => {
        const result: ResponseItemDto = {
          id: 1,
          name: 'test1',
          price: 10,
          quantity: 10,
          currency: 'USD',
          description: 'test1',
        };

        jest.spyOn(service, 'findOne').mockImplementation(async () => result);

        expect(await controller.findOne('1')).toBe(result);
      });
      it('Should throw an error if item not found', async () => {
        jest.spyOn(service, 'findOne').mockResolvedValue(null);

        try {
          await controller.findOne('2');
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundError);
          expect(error.status).toBe(404);
          expect(error?.message).toBe('Item not found');
        }
      });
    });
  });
});

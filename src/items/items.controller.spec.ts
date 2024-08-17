import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { ResponsePaginationDto } from 'src/pagination/dto/response-pagination.dto';
import { ResponseItemDto } from './dto/response-item.dto';
import { QueryPaginationDto } from 'src/pagination/dto/query-pagination.dto';

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
  });
});

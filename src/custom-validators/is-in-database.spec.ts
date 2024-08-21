import { Test } from '@nestjs/testing';

import { IsInDatabaseConstraint } from './IsInDatabase';
import { EntityManager, Repository } from 'typeorm';
import { ValidationArguments } from 'class-validator';

describe('IsInDatabaseConstraint', () => {
  let isInDatabaseConstraint: IsInDatabaseConstraint;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [],
      providers: [
        IsInDatabaseConstraint,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn(),
          },
        },
      ],
    }).compile();

    isInDatabaseConstraint = module.get<IsInDatabaseConstraint>(
      IsInDatabaseConstraint,
    );
    entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(isInDatabaseConstraint).toBeDefined();
  });

  it("should return false if findOne doesn't returns", async () => {
    const mockRepository = {
      findOne: jest.fn().mockResolvedValue(null),
    };

    jest
      .spyOn(entityManager, 'getRepository')
      .mockReturnValue(mockRepository as unknown as Repository<unknown>);

    const validationArgs: ValidationArguments = {
      value: 2,
      property: 'id',
      constraints: [Object, 'id'],
      targetName: '',
      object: {},
    };

    expect(await isInDatabaseConstraint.validate(1, validationArgs)).toBe(
      false,
    );
  });

  it('should return true if findOne returns', async () => {
    const mockRepository = {
      findOne: jest.fn().mockResolvedValue({ test: 'value' }),
    };

    jest
      .spyOn(entityManager, 'getRepository')
      .mockReturnValue(mockRepository as unknown as Repository<unknown>);

    const validationArgs: ValidationArguments = {
      value: 2,
      property: 'id',
      constraints: [Object, 'id'],
      targetName: '',
      object: {},
    };

    expect(await isInDatabaseConstraint.validate(1, validationArgs)).toBe(true);
  });
});

import { Test } from '@nestjs/testing';

import { IsInDatabaseConstraint } from './IsInDatabase';
import { EntityManager } from 'typeorm';

describe('IsInDatabaseConstraint', () => {
  let isInDatabaseConstraint: IsInDatabaseConstraint;

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
  });

  it('should be defined', () => {
    expect(isInDatabaseConstraint).toBeDefined();
  });
});

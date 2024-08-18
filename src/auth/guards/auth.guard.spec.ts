import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

function createMockExecutionContext(
  request: Partial<Request> = {},
  handler = jest.fn(),
): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => ({}),
      getNext: () => ({}),
    }),
    getClass: jest.fn(),
    getHandler: jest.fn().mockReturnValue(handler),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
    getArgByIndex: jest.fn(),
    getArgs: jest.fn(),
    getType: jest.fn(),
  } as unknown as ExecutionContext;
}

describe('auth.guard', () => {
  let guard: AuthGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        ConfigService,
        JwtService,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('Should allow access if a @Public decorator is found', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    const executionContext = createMockExecutionContext();

    expect(await guard.canActivate(executionContext)).toBe(true);
  });
});

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Role } from 'src/users/entities/user.entity';

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
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
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

  it('Should throw UnauthorizedException if no token is found in the request', async () => {
    const mockRequest = {
      headers: {},
    } as unknown as Partial<Request>;

    const executionContext = createMockExecutionContext(mockRequest);

    try {
      await guard.canActivate(executionContext);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error instanceof UnauthorizedException).toBe(true);
    }
  });

  it('Should throw UnauthorizedException if token sign is incorrect', async () => {
    const mockRequest = {
      headers: { authorization: 'Bearer valid-token' },
    } as unknown as Partial<Request>;

    const executionContext = createMockExecutionContext(mockRequest);

    try {
      await guard.canActivate(executionContext);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error instanceof UnauthorizedException).toBe(true);
    }
  });

  it('Should allow access if user is an admin', async () => {
    const jwtService = module.get<JwtService>(JwtService);

    const mockRequest = {
      headers: { authorization: 'Bearer valid-token' },
    } as unknown as Partial<Request>;

    jest.spyOn(jwtService, 'verifyAsync').mockImplementation(async () => ({
      role: Role.ADMIN,
    }));

    const executionContext = createMockExecutionContext(mockRequest);
    expect(await guard.canActivate(executionContext)).toBe(true);
  });
});

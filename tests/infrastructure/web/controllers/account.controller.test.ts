import { FastifyReply, FastifyRequest } from 'fastify';
import { AccountController } from '../../../../src/infrastructure/web/controllers/account.controller';
import { ResetUseCase } from '../../../../src/application/use-cases/reset.use-case';
import { GetBalanceUseCase } from '../../../../src/application/use-cases/get-balance.use-case';
import { DepositUseCase } from '../../../../src/application/use-cases/deposit.use-case';
import { WithdrawUseCase } from '../../../../src/application/use-cases/withdraw.use-case';
import { TransferUseCase } from '../../../../src/application/use-cases/transfer.use-case';

jest.mock('../../../../src/infrastructure/database/database');
jest.mock('../../../../src/application/use-cases/reset.use-case');
jest.mock('../../../../src/application/use-cases/get-balance.use-case');
jest.mock('../../../../src/application/use-cases/deposit.use-case');
jest.mock('../../../../src/application/use-cases/withdraw.use-case');
jest.mock('../../../../src/application/use-cases/transfer.use-case');

describe('AccountController', () => {
  let accountController: AccountController;
  let mockReply: Partial<FastifyReply>;

  beforeEach(() => {
    accountController = new AccountController();
    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should reset the database and return 200', async () => {
    const mockRequest = {} as FastifyRequest;

    await accountController.reset(mockRequest, mockReply as FastifyReply);

    expect(ResetUseCase.prototype.execute).toHaveBeenCalled();
    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(mockReply.send).toHaveBeenCalled();
  });

  it('should return the balance for a valid account', async () => {
    const mockRequest = {
      query: { account_id: '123' },
    } as unknown as FastifyRequest;

    jest.spyOn(GetBalanceUseCase.prototype, 'execute').mockReturnValue(100);

    await accountController.getBalance(mockRequest, mockReply as FastifyReply);

    expect(GetBalanceUseCase.prototype.execute).toHaveBeenCalledWith('123');
    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(mockReply.send).toHaveBeenCalledWith(100);
  });

  it('should return 404 if account balance is null', async () => {
    const mockRequest = {
      query: { account_id: '123' },
    } as unknown as FastifyRequest;

    jest.spyOn(GetBalanceUseCase.prototype, 'execute').mockReturnValue(null);

    await accountController.getBalance(mockRequest, mockReply as FastifyReply);

    expect(GetBalanceUseCase.prototype.execute).toHaveBeenCalledWith('123');
    expect(mockReply.status).toHaveBeenCalledWith(404);
    expect(mockReply.send).toHaveBeenCalledWith(0);
  });

  it('should handle deposit event and return 201', async () => {
    const mockRequest = {
      body: { type: 'deposit', destination: '123', amount: 100 },
    } as unknown as FastifyRequest;
  
    jest.spyOn(DepositUseCase.prototype, 'execute').mockReturnValue({
      id: '123',
      balance: 200,
      deposit: jest.fn(),
      withdraw: jest.fn(),
    });
  
    await accountController.handleEvent(mockRequest, mockReply as FastifyReply);
  
    expect(DepositUseCase.prototype.execute).toHaveBeenCalledWith('123', 100);
    expect(mockReply.status).toHaveBeenCalledWith(201);
    expect(mockReply.send).toHaveBeenCalledWith({
      destination: expect.objectContaining({
        id: '123',
        balance: 200,
      }),
    });
  });

  it('should handle withdraw event and return 201', async () => {
    const mockRequest = {
      body: { type: 'withdraw', origin: '123', amount: 50 },
    } as unknown as FastifyRequest;
  
    jest.spyOn(WithdrawUseCase.prototype, 'execute').mockReturnValue({
      id: '123',
      balance: 50,
      deposit: jest.fn(),
      withdraw: jest.fn(),
    });
  
    await accountController.handleEvent(mockRequest, mockReply as FastifyReply);
  
    expect(WithdrawUseCase.prototype.execute).toHaveBeenCalledWith('123', 50);
    expect(mockReply.status).toHaveBeenCalledWith(201);
    expect(mockReply.send).toHaveBeenCalledWith({
      origin: expect.objectContaining({
        id: '123',
        balance: 50,
      }),
    });
  });

  it('should handle transfer event and return 201', async () => {
    const mockRequest = {
      body: { type: 'transfer', origin: '123', destination: '456', amount: 50 },
    } as unknown as FastifyRequest;
  
    jest.spyOn(TransferUseCase.prototype, 'execute').mockReturnValue({
      origin: { id: '123', balance: 50, deposit: jest.fn(), withdraw: jest.fn() },
      destination: { id: '456', balance: 150, deposit: jest.fn(), withdraw: jest.fn() },
    });
  
    await accountController.handleEvent(mockRequest, mockReply as FastifyReply);
  
    expect(TransferUseCase.prototype.execute).toHaveBeenCalledWith('123', '456', 50);
    expect(mockReply.status).toHaveBeenCalledWith(201);
    expect(mockReply.send).toHaveBeenCalledWith({
      origin: expect.objectContaining({ id: '123', balance: 50 }),
      destination: expect.objectContaining({ id: '456', balance: 150 }),
    });
  });

  it('should return 400 for invalid event type', async () => {
    const mockRequest = {
      body: { type: 'invalid', amount: 100 },
    } as unknown as FastifyRequest;

    await accountController.handleEvent(mockRequest, mockReply as FastifyReply);

    expect(mockReply.status).toHaveBeenCalledWith(400);
    expect(mockReply.send).toHaveBeenCalledWith({ error: 'Invalid event type' });
  });
});
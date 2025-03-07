import { TransferUseCase } from '../../../src/application/use-cases/transfer.use-case';
import { AccountRepository } from '../../../src/application/interfaces/account-repository.interface';
import { Account } from '../../../src/domain/entities/account.entity';

describe('TransferUseCase', () => {
  let transferUseCase: TransferUseCase;
  let mockAccountRepository: jest.Mocked<AccountRepository>;

  beforeEach(() => {
    mockAccountRepository = {
      getAccountById: jest.fn(),
      saveAccount: jest.fn(),
      reset: jest.fn(),
    } as unknown as jest.Mocked<AccountRepository>;

    transferUseCase = new TransferUseCase(mockAccountRepository);
  });

  it('should transfer the amount between two existing accounts', () => {
    const originAccount = new Account('origin');
    originAccount.balance = 200;
    originAccount.withdraw = jest.fn().mockReturnValue(true);

    const destinationAccount = new Account('destination');
    destinationAccount.deposit = jest.fn();

    mockAccountRepository.getAccountById
      .mockImplementationOnce(() => originAccount)
      .mockImplementationOnce(() => destinationAccount);

    const result = transferUseCase.execute('origin', 'destination', 100);

    expect(result).toEqual({ origin: originAccount, destination: destinationAccount });
    expect(originAccount.withdraw).toHaveBeenCalledWith(100);
    expect(destinationAccount.deposit).toHaveBeenCalledWith(100);
    expect(mockAccountRepository.saveAccount).toHaveBeenCalledWith(originAccount);
    expect(mockAccountRepository.saveAccount).toHaveBeenCalledWith(destinationAccount);
  });

  it('should create a new destination account if it does not exist', () => {
    const originAccount = new Account('origin');
    originAccount.balance = 200;
    originAccount.withdraw = jest.fn().mockReturnValue(true);

    mockAccountRepository.getAccountById
      .mockImplementationOnce(() => originAccount)
      .mockImplementationOnce(() => null);

    const result = transferUseCase.execute('origin', 'new-destination', 50);

    expect(result).not.toBeNull();
    expect(result?.origin).toEqual(originAccount);
    expect(result?.destination.id).toBe('new-destination');
    expect(result?.destination.balance).toBe(50);
    expect(mockAccountRepository.saveAccount).toHaveBeenCalledWith(originAccount);
    expect(mockAccountRepository.saveAccount).toHaveBeenCalledWith(result?.destination);
  });

  it('should return null if the origin account does not exist', () => {
    mockAccountRepository.getAccountById.mockReturnValueOnce(null);

    const result = transferUseCase.execute('non-existent-origin', 'destination', 100);

    expect(result).toBeNull();
    expect(mockAccountRepository.getAccountById).toHaveBeenCalledWith('non-existent-origin');
  });

  it('should return null if the origin account does not have enough balance', () => {
    const originAccount = new Account('origin');
    originAccount.balance = 50;
    originAccount.withdraw = jest.fn().mockReturnValue(false);

    mockAccountRepository.getAccountById.mockReturnValueOnce(originAccount);

    const result = transferUseCase.execute('origin', 'destination', 100);

    expect(result).toBeNull();
    expect(originAccount.withdraw).toHaveBeenCalledWith(100);
    expect(mockAccountRepository.saveAccount).not.toHaveBeenCalled();
  });
});
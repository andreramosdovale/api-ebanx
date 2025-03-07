import { WithdrawUseCase } from '../../../src/application/use-cases/withdraw.use-case';
import { AccountRepository } from '../../../src/application/interfaces/account-repository.interface';
import { Account } from '../../../src/domain/entities/account.entity';

describe('WithdrawUseCase', () => {
  let withdrawUseCase: WithdrawUseCase;
  let mockAccountRepository: jest.Mocked<AccountRepository>;

  beforeEach(() => {
    mockAccountRepository = {
      getAccountById: jest.fn(),
      saveAccount: jest.fn(),
      reset: jest.fn(),
    } as unknown as jest.Mocked<AccountRepository>;

    withdrawUseCase = new WithdrawUseCase(mockAccountRepository);
  });

  it('should withdraw the amount from an existing account', () => {
    const account = new Account('account-id');
    account.balance = 200;
    account.withdraw = jest.fn().mockReturnValue(true);

    mockAccountRepository.getAccountById.mockReturnValueOnce(account);

    const result = withdrawUseCase.execute('account-id', 100);

    expect(result).toEqual(account);
    expect(account.withdraw).toHaveBeenCalledWith(100);
    expect(mockAccountRepository.saveAccount).toHaveBeenCalledWith(account);
  });

  it('should return null if the account does not exist', () => {
    mockAccountRepository.getAccountById.mockReturnValueOnce(null);

    const result = withdrawUseCase.execute('non-existent-account', 100);

    expect(result).toBeNull();
    expect(mockAccountRepository.getAccountById).toHaveBeenCalledWith('non-existent-account');
    expect(mockAccountRepository.saveAccount).not.toHaveBeenCalled();
  });

  it('should return null if the account does not have enough balance', () => {
    const account = new Account('account-id');
    account.balance = 50;
    account.withdraw = jest.fn().mockReturnValue(false);

    mockAccountRepository.getAccountById.mockReturnValueOnce(account);

    const result = withdrawUseCase.execute('account-id', 100);

    expect(result).toBeNull();
    expect(account.withdraw).toHaveBeenCalledWith(100);
    expect(mockAccountRepository.saveAccount).not.toHaveBeenCalled();
  });
});
import { GetBalanceUseCase } from '../../../src/application/use-cases/get-balance.use-case';
import { AccountRepository } from '../../../src/application/interfaces/account-repository.interface';
import { Account } from '../../../src/domain/entities/account.entity';

describe('GetBalanceUseCase', () => {
  let getBalanceUseCase: GetBalanceUseCase;
  let mockAccountRepository: jest.Mocked<AccountRepository>;

  beforeEach(() => {
    mockAccountRepository = {
      getAccountById: jest.fn(),
      saveAccount: jest.fn(),
      reset: jest.fn(),
    } as unknown as jest.Mocked<AccountRepository>;

    getBalanceUseCase = new GetBalanceUseCase(mockAccountRepository);
  });

  it('should return the balance of an existing account', () => {
    const existingAccount = new Account('123');
    existingAccount.balance = 200;

    mockAccountRepository.getAccountById.mockReturnValue(existingAccount);

    const result = getBalanceUseCase.execute('123');

    expect(result).toBe(200);
    expect(mockAccountRepository.getAccountById).toHaveBeenCalledWith('123');
  });

  it('should return null if the account does not exist', () => {
    mockAccountRepository.getAccountById.mockReturnValue(null);

    const result = getBalanceUseCase.execute('123');

    expect(result).toBeNull();
    expect(mockAccountRepository.getAccountById).toHaveBeenCalledWith('123');
  });
});
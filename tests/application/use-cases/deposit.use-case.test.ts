import { DepositUseCase } from '../../../src/application/use-cases/deposit.use-case';
import { AccountRepository } from '../../../src/application/interfaces/account-repository.interface';
import { Account } from '../../../src/domain/entities/account.entity';

describe('DepositUseCase', () => {
  let depositUseCase: DepositUseCase;
  let mockAccountRepository: jest.Mocked<AccountRepository>;

  beforeEach(() => {
    mockAccountRepository = {
      getAccountById: jest.fn(),
      saveAccount: jest.fn(),
      reset: jest.fn(),
    };

    depositUseCase = new DepositUseCase(mockAccountRepository);
  });

  it('should create a new account and deposit the amount if account does not exist', () => {
    mockAccountRepository.getAccountById.mockReturnValue(null);

    const result = depositUseCase.execute('123', 100);

    expect(result.id).toBe('123');
    expect(result.balance).toBe(100);

    expect(mockAccountRepository.saveAccount).toHaveBeenCalledWith(result);
  });

  it('should deposit the amount into an existing account', () => {
    const existingAccount = new Account('123');
    existingAccount.deposit = jest.fn();

    mockAccountRepository.getAccountById.mockReturnValue(existingAccount);

    const result = depositUseCase.execute('123', 50);

    expect(existingAccount.deposit).toHaveBeenCalledWith(50);
    expect(result.balance).toBe(existingAccount.balance);
    expect(mockAccountRepository.saveAccount).toHaveBeenCalledWith(existingAccount);
  });

  it('should throw an error if the deposit amount is invalid', () => {
    expect(() => depositUseCase.execute('123', -50)).toThrowError('Invalid deposit amount');
  });
});
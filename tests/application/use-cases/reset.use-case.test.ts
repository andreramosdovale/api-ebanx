import { ResetUseCase } from '../../../src/application/use-cases/reset.use-case';
import { AccountRepository } from '../../../src/application/interfaces/account-repository.interface';

describe('ResetUseCase', () => {
  let resetUseCase: ResetUseCase;
  let mockAccountRepository: jest.Mocked<AccountRepository>;

  beforeEach(() => {
    mockAccountRepository = {
      getAccountById: jest.fn(),
      saveAccount: jest.fn(),
      reset: jest.fn(),
    } as unknown as jest.Mocked<AccountRepository>;

    resetUseCase = new ResetUseCase(mockAccountRepository);
  });

  it('should call the reset method of the account repository', () => {
    resetUseCase.execute();

    expect(mockAccountRepository.reset).toHaveBeenCalled();
    expect(mockAccountRepository.reset).toHaveBeenCalledTimes(1);
  });
});
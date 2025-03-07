import { AccountRepository } from '../interfaces/account-repository.interface';

export class GetBalanceUseCase {
  constructor(private accountRepository: AccountRepository) {}

  execute(accountId: string): number | null {
    const account = this.accountRepository.getAccountById(accountId);
    return account ? account.balance : null;
  }
}
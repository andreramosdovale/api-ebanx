import { Account } from '../../domain/entities/account.entity';
import { AccountRepository } from '../interfaces/account-repository.interface';

export class WithdrawUseCase {
  constructor(private accountRepository: AccountRepository) {}

  execute(accountId: string, amount: number): Account | null {
    const account = this.accountRepository.getAccountById(accountId);
    if (!account || !account.withdraw(amount)) {
      return null;
    }
    this.accountRepository.saveAccount(account);
    return account;
  }
}
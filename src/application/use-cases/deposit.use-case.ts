import { AccountRepository } from '../interfaces/account-repository.interface';
import { Account } from '../../domain/entities/account.entity';

export class DepositUseCase {
  constructor(private accountRepository: AccountRepository) {}

  execute(accountId: string, amount: number): Account {
    let account = this.accountRepository.getAccountById(accountId);
    if (!account) {
      account = new Account(accountId);
    }
    account.deposit(amount);
    this.accountRepository.saveAccount(account);
    return account;
  }
}
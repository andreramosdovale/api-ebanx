import { Account } from '../../domain/entities/account.entity';
import { AccountRepository } from '../interfaces/account-repository.interface';

export class DepositUseCase {
  constructor(private accountRepository: AccountRepository) {}

  execute(accountId: string, amount: number): Account {
    if (amount <= 0) {
      throw new Error('Invalid deposit amount');
    }

    let account = this.accountRepository.getAccountById(accountId);

    if (!account) {
      account = new Account(accountId);
    }

    account.deposit(amount);
    this.accountRepository.saveAccount(account);

    return account;
  }
}
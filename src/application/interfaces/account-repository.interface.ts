import { Account } from '../../domain/entities/account.entity';

export interface AccountRepository {
  reset(): void;
  getAccountById(accountId: string): Account | null;
  saveAccount(account: Account): void;
}
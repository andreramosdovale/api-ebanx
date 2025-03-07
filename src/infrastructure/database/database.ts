import { Account } from '../../domain/entities/account.entity';
import { AccountRepository } from '../../application/interfaces/account-repository.interface';

export class Database implements AccountRepository {
  private static instance: Database;
  private accounts: Record<string, Account> = {};

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  reset(): void {
    this.accounts = {};
  }

  getAccountById(accountId: string): Account | null {
    return this.accounts[accountId] || null;
  }

  saveAccount(account: Account): void {
    this.accounts[account.id] = account;
  }
}
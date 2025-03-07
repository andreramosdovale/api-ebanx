import { Database } from '../../../src/infrastructure/database/database';
import { Account } from '../../../src/domain/entities/account.entity';

describe('Database', () => {
  let database: Database;

  beforeEach(() => {
    database = Database.getInstance();
    database.reset();
  });

  it('should return the same instance (singleton)', () => {
    const anotherInstance = Database.getInstance();
    expect(database).toBe(anotherInstance);
  });

  it('should reset the accounts', () => {
    const account: Account = { id: '123', balance: 100, deposit: jest.fn(), withdraw: jest.fn() };
    database.saveAccount(account);

    expect(database.getAccountById('123')).toEqual(account);

    database.reset();

    expect(database.getAccountById('123')).toBeNull();
  });

  it('should save an account', () => {
    const account: Account = { id: '123', balance: 100, deposit: jest.fn(), withdraw: jest.fn() };

    database.saveAccount(account);

    const savedAccount = database.getAccountById('123');
    expect(savedAccount).toEqual(account);
  });

  it('should retrieve an account by ID', () => {
    const account: Account = { id: '123', balance: 100, deposit: jest.fn(), withdraw: jest.fn() };

    database.saveAccount(account);

    const retrievedAccount = database.getAccountById('123');
    expect(retrievedAccount).toEqual(account);
  });

  it('should return null if account does not exist', () => {
    const retrievedAccount = database.getAccountById('nonexistent-id');
    expect(retrievedAccount).toBeNull();
  });
});
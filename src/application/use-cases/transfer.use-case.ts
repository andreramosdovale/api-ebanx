import { AccountRepository } from '../interfaces/account-repository.interface';
import { Account } from '../../domain/entities/account.entity';

export class TransferUseCase {
  constructor(private accountRepository: AccountRepository) {}

  execute(originId: string, destinationId: string, amount: number): { origin: Account; destination: Account } | null {
    const origin = this.accountRepository.getAccountById(originId);
    if (!origin || !origin.withdraw(amount)) {
      return null;
    }

    let destination = this.accountRepository.getAccountById(destinationId);
    if (!destination) {
      destination = new Account(destinationId);
    }
    destination.deposit(amount);

    this.accountRepository.saveAccount(origin);
    this.accountRepository.saveAccount(destination);

    return { origin, destination };
  }
}
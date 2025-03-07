import { AccountRepository } from '../interfaces/account-repository.interface';

export class ResetUseCase {
  constructor(private accountRepository: AccountRepository) {}

  execute(): void {
    this.accountRepository.reset();
  }
}
export class Account {
  constructor(public id: string, public balance: number = 0) {}

  deposit(amount: number): void {
    this.balance += amount;
  }

  withdraw(amount: number): boolean {
    if (this.balance < amount) return false;
    this.balance -= amount;
    return true;
  }
}
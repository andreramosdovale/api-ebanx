import { FastifyReply, FastifyRequest } from 'fastify';
import { Database } from '../../database/database';
import { ResetUseCase } from '../../../application/use-cases/reset.use-case';
import { GetBalanceUseCase } from '../../../application/use-cases/get-balance.use-case';
import { DepositUseCase } from '../../../application/use-cases/deposit.use-case';
import { WithdrawUseCase } from '../../../application/use-cases/withdraw.use-case';
import { TransferUseCase } from '../../../application/use-cases/transfer.use-case';

export class AccountController {
  private db = Database.getInstance();
  private resetUseCase = new ResetUseCase(this.db);
  private getBalanceUseCase = new GetBalanceUseCase(this.db);
  private depositUseCase = new DepositUseCase(this.db);
  private withdrawUseCase = new WithdrawUseCase(this.db);
  private transferUseCase = new TransferUseCase(this.db);

  reset = async (req: FastifyRequest, reply: FastifyReply) => {
    this.resetUseCase.execute();
    return reply.status(200).send();
  };

  getBalance = async (req: FastifyRequest, reply: FastifyReply) => {
    const { account_id } = req.query as { account_id: string };
    const balance = this.getBalanceUseCase.execute(account_id);
    if (balance === null) {
      return reply.status(404).send(0);
    }
    return reply.status(200).send(balance);
  };

  handleEvent = async (req: FastifyRequest, reply: FastifyReply) => {
    const { type, origin, destination, amount } = req.body as { type: string; origin?: string; destination?: string; amount: number; };
    switch (type) {
      case 'deposit': {
        const result = this.depositUseCase.execute(destination!, amount);
        return reply.status(201).send({ destination: result });
      }
      case 'withdraw': {
        const result = this.withdrawUseCase.execute(origin!, amount);
        if (!result) return reply.status(404).send(0);
        return reply.status(201).send({ origin: result });
      }
      case 'transfer': {
        const result = this.transferUseCase.execute(origin!, destination!, amount);
        if (!result) return reply.status(404).send(0);
        return reply.status(201).send(result);
      }
      default:
        return reply.status(400).send({ error: 'Invalid event type' });
    }
  };
}
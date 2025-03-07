import { FastifyInstance } from 'fastify';
import { AccountController } from '../controllers/account.controller';

export const registerRoutes = (app: FastifyInstance) => {
  const accountController = new AccountController();
  
  app.get('/', accountController.default)
  app.post('/reset', accountController.reset);
  app.get('/balance', accountController.getBalance);
  app.post('/event', accountController.handleEvent);
};
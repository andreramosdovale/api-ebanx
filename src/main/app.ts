import fastify from 'fastify';
import { registerRoutes } from '../infrastructure/web/routes';

export const startServer = async () => {
  const app = fastify();
  registerRoutes(app);

  try {
    await app.listen({ port: 3000 });
    console.log('Server is running on http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
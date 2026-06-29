import { FastifyInstance } from 'fastify';
import { PlayersController } from '../controllers/players.controller';
export async function playersRoutes(app: FastifyInstance) {
  const controller = new PlayersController();

  app.get('/players', async () => {
    return controller.getPlayers();
  });
}
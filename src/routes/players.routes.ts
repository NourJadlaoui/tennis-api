import { FastifyInstance } from "fastify";
import { PlayersController } from "../controllers/players.controller";
import { PlayersRepository } from "../repositories/players.repository";
import { PlayersService } from "../services/players.service";

export async function playersRoutes(app: FastifyInstance) {
  const repository = new PlayersRepository();
  const service = new PlayersService(repository);
  const controller = new PlayersController(service);
  app.get("/players", async () => {
    return controller.getPlayers();
  });

  app.get("/players/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const playerId = Number(id);

    if (!Number.isInteger(playerId) || playerId <= 0) {
      return reply.status(400).send({
        message: "Invalid player id",
      });
    }

    try {
      const player = controller.getPlayerById(playerId);
      return reply.status(200).send(player);
    } catch {
      return reply.status(404).send({
        message: "Player not found",
      });
    }
  });
}

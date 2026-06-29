import { FastifyInstance } from "fastify";
import { PlayersController } from "../controllers/players.controller";
import { PlayersRepository } from "../repositories/players.repository";
import { PlayersService } from "../services/players.service";
import { CreatePlayerSchema } from "../validators/player.validator";

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

  app.post("/players", async (request, reply) => {
    try {
      const parsed = CreatePlayerSchema.safeParse(request.body);
      

      if (!parsed.success) {
        return reply.status(400).send({
          message: "Validation error",
          errors: parsed.error.flatten(),
        });
      }

      const newPlayer = controller.createPlayer(parsed.data);

      return reply.status(201).send(newPlayer);
    } catch (err) {
      return reply.status(500).send({
        message: "Internal server error",
      });
    }
  });
}

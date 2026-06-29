import { FastifyInstance } from "fastify";
import { StatsController } from "../controllers/stats.controller";
import { StatsService } from "../services/stats.service";

export async function statsRoutes(app: FastifyInstance) {
  const service = new StatsService();
  const controller = new StatsController(service);
  app.get("/stats", async () => {
    return controller.getStats();
  });
}

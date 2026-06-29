import Fastify from "fastify";
import { playersRoutes } from "./routes/players.routes";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  // Routes
  app.register(playersRoutes);

  // Health check
  app.get("/health", async () => {
    return { status: "ok" };
  });

  // Global error handler
  app.setErrorHandler((error, request, reply) => {
    app.log.error(error);

    reply.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
    });
  });

  return app;
}

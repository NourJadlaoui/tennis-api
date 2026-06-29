import { buildApp } from './app';

const start = async () => {
  const app = buildApp();

  const port = 3000;
  const host = '0.0.0.0';

  try {
    await app.listen({ port, host });
    console.log(`🚀 Server running on http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
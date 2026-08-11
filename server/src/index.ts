import 'dotenv/config';
import app from './app';
import { connectDb } from './config/db';

const PORT = process.env.PORT ?? 4000;

async function main() {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`[server] listening on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error('[server] failed to start', err);
  process.exit(1);
});

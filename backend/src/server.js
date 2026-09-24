const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
  quiet: true,
});

const app = require('./app');
const pool = require('./config/db');

const port = Number(process.env.PORT || 3000);

async function startServer() {
  await pool.query('SELECT 1');

  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Backend запущен на порту ${port}`);
  });

  async function shutdown() {
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  }

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer().catch((error) => {
  console.error('Не удалось запустить backend:', error);
  process.exit(1);
});

import { createServer } from 'http';
import app from './app.js';

const port = process.env.PORT || 3000;

const server = createServer(app);

server.addListener('listening', () => {
  console.log(`[INFO] app server listening on port ${port}`);
});

server.addListener('error', (error) => {
  console.error(`[ERROR] ${error.message}`);
  process.exit(1);
});

server.listen(port);

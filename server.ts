import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { initializeWebSocketServer } from './server/websocket';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  const io = initializeWebSocketServer(server);

  io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('message', (msg) => {
      console.log('Received message:', msg);
    });

    socket.on('joinEntry', (entryId) => {
      socket.join(`entry:${entryId}`);
    });

    socket.on('leaveEntry', (entryId) => {
      socket.leave(`entry:${entryId}`);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});
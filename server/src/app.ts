import cors from 'cors';
import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import { roomsRouter } from './routes/rooms.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/rooms', roomsRouter);

app.use(errorHandler);

export default app;

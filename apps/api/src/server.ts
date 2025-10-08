import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectToMongo } from './services/mongo';
import { router as healthRouter } from './routes/health';

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/health', healthRouter);

const port = Number(process.env.PORT || 4000);

async function start() {
  await connectToMongo();
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  start();
}

export { app };


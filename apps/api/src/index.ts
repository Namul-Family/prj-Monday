import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import { bookmarksRouter } from './routes/bookmarks';
import { tagsRouter } from './routes/tags';

dotenv.config();

const app: Express = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// ✅ 미들웨어
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ 헬스체크
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ✅ API 라우터 연결 (헬스체크 다음, 에러 핸들러 전에)
app.use('/api/bookmarks', bookmarksRouter);
app.use('/api/tags', tagsRouter);

// ✅ 에러 핸들러
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 
      process.env.NODE_ENV === 'development' 
        ? String((err as Error)?.message ?? err) 
        : 'Something went wrong',
  });
});

// ✅ 404 핸들러 (맨 마지막)
app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// ✅ 종료 처리
process.on('SIGINT', async () => { await prisma.$disconnect(); process.exit(0); });
process.on('SIGTERM', async () => { await prisma.$disconnect(); process.exit(0); });

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export { app, prisma };

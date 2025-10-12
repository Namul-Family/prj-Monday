import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bookmarkRoutes from './routes/bookmarks';
import tagRoutes from './routes/tags';

// Load environment variables
dotenv.config();

const app: Express = express();           // <-- 명시적 타입
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {   // <-- req/res 타입
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// API routes
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/tags', tagRoutes);

// Error handling middleware
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {  // <-- err: unknown 권장
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? String((err as Error)?.message ?? err) : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {        // <-- req/res 타입
  res.status(404).json({ error: 'Not Found' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export { app, prisma };
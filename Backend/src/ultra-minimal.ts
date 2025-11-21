/**
 * Testing with authRoutes only
 */
import Fastify from 'fastify';
import cors from '@fastify/cors';
import authPlugin from './plugins/auth.js';
import { authRoutes } from './routes/auth.js';
import { initializeDatabase, closePool } from './utils/database.js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = Fastify({ logger: true });

// Register CORS
await app.register(cors, {
  origin: true,
  credentials: true,
});

// Register auth plugin
await app.register(authPlugin);

// Health check
app.get('/health', async () => ({
  status: 'ok',
  time: new Date().toISOString(),
}));

// Register auth routes
await authRoutes(app);

const gracefulShutdown = async () => {
  await closePool();
  await app.close();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

const start = async () => {
  try {
    const dbPool = await initializeDatabase();
    
    if (!dbPool) {
      throw new Error('Failed to initialize database connection');
    }
    
    console.log('Database connected');
    
    await app.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server with authRoutes on http://localhost:3001');
    console.log('🔐 Test login: POST http://localhost:3001/auth/login');
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
};

start();

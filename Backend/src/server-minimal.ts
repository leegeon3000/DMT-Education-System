/**
 * Minimal Server - For testing SQL Server auth without complex plugins
 */
import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { initializeDatabase, query, closePool } from './utils/database.js';

dotenv.config({ path: '.env.local' });

const app = Fastify({ logger: true });

// Simple CORS - allow all in development
app.register(cors, {
  origin: true,
  credentials: true,
});

// JWT
app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'dev-secret',
  sign: { expiresIn: '24h' }
});

// Health check
app.get('/health', async () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
}));

// Login
app.post('/api/auth/login', async (req, reply) => {
  try {
    const { email, password } = req.body as any;

    if (!email || !password) {
      return reply.code(400).send({ error: 'Email and password required' });
    }

    const result = await query('SELECT * FROM users WHERE email = @p1', [email]);

    if (result.rows.length === 0) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    const token = await reply.jwtSign({
      sub: String(user.id),
      email: user.email,
      role_id: user.role_id,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role_id: user.role_id,
      },
    };
  } catch (error: any) {
    app.log.error(error);
    return reply.code(500).send({ error: error.message });
  }
});

// Get current user
app.get('/api/auth/me', async (req, reply) => {
  try {
    await req.jwtVerify();
    const userId = Number((req.user as any).sub);

    const result = await query(
      'SELECT id, email, full_name, role_id, status FROM users WHERE id = @p1',
      [userId]
    );

    if (result.rows.length === 0) {
      return reply.code(404).send({ error: 'User not found' });
    }

    return { user: result.rows[0] };
  } catch (error: any) {
    return reply.code(401).send({ error: 'Authentication required' });
  }
});

const port = Number(process.env.PORT || 3001);

// Graceful shutdown
const gracefulShutdown = async () => {
  app.log.info('Shutting down...');
  await closePool();
  await app.close();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start
const start = async () => {
  try {
    await initializeDatabase();
    app.log.info('Database connected');

    await app.listen({ port, host: '0.0.0.0' });
    app.log.info(`Minimal server running on http://localhost:${port}`);
    app.log.info(`Test: curl http://localhost:${port}/health`);
    app.log.info(`🔐 Login: POST http://localhost:${port}/api/auth/login`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

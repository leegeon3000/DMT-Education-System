import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ResponseHelper } from '../utils/response';

export function validateBody<T extends z.ZodSchema>(schema: T) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const parsed = schema.parse(request.body);
      request.body = parsed;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ResponseHelper.error(reply, `Validation error: ${error.issues.map(i => i.message).join(', ')}`, 400);
      }
      return ResponseHelper.error(reply, 'Invalid request data', 400);
    }
  };
}

export function validateParams<T extends z.ZodSchema>(schema: T) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const parsed = schema.parse(request.params);
      request.params = parsed;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ResponseHelper.error(reply, `Parameter validation error: ${error.issues.map(i => i.message).join(', ')}`, 400);
      }
      return ResponseHelper.error(reply, 'Invalid parameters', 400);
    }
  };
}

export function validateQuery<T extends z.ZodSchema>(schema: T) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const parsed = schema.parse(request.query);
      request.query = parsed;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ResponseHelper.error(reply, `Query validation error: ${error.issues.map(i => i.message).join(', ')}`, 400);
      }
      return ResponseHelper.error(reply, 'Invalid query parameters', 400);
    }
  };
}

// Common schemas
export const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
});

export const IdParamSchema = z.object({
  id: z.coerce.number().min(1),
});
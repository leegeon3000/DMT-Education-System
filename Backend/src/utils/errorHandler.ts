import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ResponseHelper } from '../utils/response';

export async function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  request.log.error(error);

  // JWT errors
  if (error.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER') {
    return ResponseHelper.unauthorized(reply);
  }

  if (error.code === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID') {
    return ResponseHelper.unauthorized(reply);
  }

  // Validation errors
  if (error.code === 'FST_ERR_VALIDATION') {
    return ResponseHelper.error(reply, error.message, 400);
  }

  // Database/Supabase errors
  if (error.message?.includes('duplicate key')) {
    return ResponseHelper.error(reply, 'Resource already exists', 409);
  }

  if (error.message?.includes('foreign key')) {
    return ResponseHelper.error(reply, 'Invalid reference to related resource', 400);
  }

  // Default server error
  return ResponseHelper.serverError(reply, process.env.NODE_ENV === 'development' ? error.message : undefined);
}

export function asyncHandler(fn: Function) {
  return (request: FastifyRequest, reply: FastifyReply) => {
    Promise.resolve(fn(request, reply)).catch((error) => {
      request.log.error(error);
      return ResponseHelper.serverError(reply);
    });
  };
}
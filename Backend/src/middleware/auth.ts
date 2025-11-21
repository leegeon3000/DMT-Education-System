import { FastifyRequest, FastifyReply } from 'fastify';
import { ResponseHelper } from '../utils/response';

export interface AuthenticatedUser {
  sub: string;
  email: string;
  role_id: number;
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: AuthenticatedUser;
  }
}

export async function authenticateToken(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    return ResponseHelper.unauthorized(reply);
  }
}

export function requireRole(allowedRoles: number[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    await authenticateToken(request, reply);
    
    if (!request.user?.role_id || !allowedRoles.includes(request.user.role_id)) {
      return ResponseHelper.forbidden(reply);
    }
  };
}

// Role constants for easy reference
export const ROLES = {
  ADMIN: 1,
  STAFF: 2,
  TEACHER: 3,
  STUDENT: 4,
} as const;
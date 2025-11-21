import { FastifyReply } from 'fastify';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class ResponseHelper {
  static success<T>(reply: FastifyReply, data: T, message?: string, code = 200) {
    return reply.code(code).send({
      success: true,
      data,
      message,
    } as ApiResponse<T>);
  }

  static successWithPagination<T>(
    reply: FastifyReply,
    data: T[],
    pagination: { page: number; limit: number; total: number },
    message?: string
  ) {
    const pages = Math.ceil(pagination.total / pagination.limit);
    return reply.code(200).send({
      success: true,
      data,
      message,
      pagination: { ...pagination, pages },
    } as ApiResponse<T[]>);
  }

  static error(reply: FastifyReply, error: string, code = 400) {
    return reply.code(code).send({
      success: false,
      error,
    } as ApiResponse);
  }

  static notFound(reply: FastifyReply, resource = 'Resource') {
    return reply.code(404).send({
      success: false,
      error: `${resource} not found`,
    } as ApiResponse);
  }

  static unauthorized(reply: FastifyReply) {
    return reply.code(401).send({
      success: false,
      error: 'Unauthorized access',
    } as ApiResponse);
  }

  static forbidden(reply: FastifyReply) {
    return reply.code(403).send({
      success: false,
      error: 'Insufficient permissions',
    } as ApiResponse);
  }

  static serverError(reply: FastifyReply, error?: string) {
    return reply.code(500).send({
      success: false,
      error: error || 'Internal server error',
    } as ApiResponse);
  }

  static badRequest(reply: FastifyReply, error: string) {
    return reply.code(400).send({
      success: false,
      error,
    } as ApiResponse);
  }

  static created<T>(reply: FastifyReply, data: T, message?: string) {
    return reply.code(201).send({
      success: true,
      data,
      message: message || 'Resource created successfully',
    } as ApiResponse<T>);
  }
}
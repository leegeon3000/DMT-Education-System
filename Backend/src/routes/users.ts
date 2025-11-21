import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { supabase } from '../server';
import { ResponseHelper } from '../utils/response';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth';
import { validateBody, validateParams, validateQuery, PaginationSchema, IdParamSchema } from '../middleware/validation';

const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(1),
  role_id: z.number().int().min(1).max(4),
  phone: z.string().optional(),
  address: z.string().optional(),
  birth_date: z.string().optional(),
  status: z.boolean().default(true),
});

const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  full_name: z.string().min(1).optional(),
  role_id: z.number().int().min(1).max(4).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  birth_date: z.string().optional(),
  status: z.boolean().optional(),
});

export async function usersRoutes(app: FastifyInstance) {
  // GET /users - List users with pagination and search
  app.get('/users', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])],
    preHandler: [validateQuery(PaginationSchema)]
  }, async (req: any, reply) => {
    try {
      const { page, limit, search } = req.query;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('users')
        .select('id, email, full_name, role_id, phone, status, created_at, roles(name)', { count: 'exact' })
        .range(offset, offset + limit - 1)
        .order('id');

      if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const { data, error, count } = await query;
      if (error) throw error;

      return ResponseHelper.successWithPagination(
        reply,
        data,
        { page, limit, total: count || 0 }
      );
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // GET /users/:id - Get user by ID
  app.get('/users/:id', {
    preValidation: [authenticateToken],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply) => {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, role_id, phone, address, birth_date, status, created_at, roles(name)')
        .eq('id', id)
        .single();

      if (error || !data) {
        return ResponseHelper.notFound(reply, 'User');
      }

      return ResponseHelper.success(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // POST /users - Create new user
  app.post('/users', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])],
    preHandler: [validateBody(CreateUserSchema)]
  }, async (req: any, reply) => {
    try {
      const userData = req.body;
      
      // Hash password
      const saltRounds = 12;
      const password_hash = await bcrypt.hash(userData.password, saltRounds);
      
      const { password, ...dataToInsert } = userData;
      const { data, error } = await supabase
        .from('users')
        .insert({ ...dataToInsert, password_hash })
        .select('id, email, full_name, role_id, status')
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return ResponseHelper.error(reply, 'Email already exists', 409);
        }
        throw error;
      }

      return ResponseHelper.success(reply, data, 'User created successfully', 201);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // PUT /users/:id - Update user
  app.put('/users/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])],
    preHandler: [validateParams(IdParamSchema), validateBody(UpdateUserSchema)]
  }, async (req: any, reply) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Hash password if provided
      if (updateData.password) {
        const saltRounds = 12;
        updateData.password_hash = await bcrypt.hash(updateData.password, saltRounds);
        delete updateData.password;
      }

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select('id, email, full_name, role_id, status')
        .single();

      if (error || !data) {
        return ResponseHelper.notFound(reply, 'User');
      }

      return ResponseHelper.success(reply, data, 'User updated successfully');
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // DELETE /users/:id - Delete user
  app.delete('/users/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply) => {
    try {
      const { id } = req.params;
      
      // Check if user exists and is not the current user
      if (parseInt(id) === parseInt(req.user.sub)) {
        return ResponseHelper.error(reply, 'Cannot delete your own account', 400);
      }

      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        if (error.code === '23503') { // Foreign key constraint
          return ResponseHelper.error(reply, 'Cannot delete user with associated records', 409);
        }
        throw error;
      }

      return ResponseHelper.success(reply, null, 'User deleted successfully');
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });
}

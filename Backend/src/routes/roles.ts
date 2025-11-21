import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { supabase } from '../server';
import { ResponseHelper } from '../utils/response';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth';
import { validateBody, validateParams, validateQuery, PaginationSchema, IdParamSchema } from '../middleware/validation';

const CreateRoleSchema = z.object({
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

const UpdateRoleSchema = z.object({
  code: z.string().min(1).max(50).optional(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
});

export async function rolesRoutes(app: FastifyInstance) {
  // GET /roles - List all roles
  app.get('/roles', {
    preValidation: [authenticateToken]
  }, async (req: any, reply: any) => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('id');

      if (error) throw error;

      return ResponseHelper.success(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // GET /roles/:id - Get role by ID
  app.get('/roles/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return ResponseHelper.notFound(reply, 'Role');
      }

      return ResponseHelper.success(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // POST /roles - Create new role
  app.post('/roles', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])],
    preHandler: [validateBody(CreateRoleSchema)]
  }, async (req: any, reply: any) => {
    try {
      const roleData = req.body;
      
      const { data, error } = await supabase
        .from('roles')
        .insert(roleData)
        .select('*')
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return ResponseHelper.error(reply, 'Role code already exists', 409);
        }
        throw error;
      }

      return ResponseHelper.success(reply, data, 'Role created successfully', 201);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // PUT /roles/:id - Update role
  app.put('/roles/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])],
    preHandler: [validateParams(IdParamSchema), validateBody(UpdateRoleSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const { data, error } = await supabase
        .from('roles')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();

      if (error || !data) {
        return ResponseHelper.notFound(reply, 'Role');
      }

      return ResponseHelper.success(reply, data, 'Role updated successfully');
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // DELETE /roles/:id - Delete role
  app.delete('/roles/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      
      // Check if role is being used by any users
      const { data: usersWithRole } = await supabase
        .from('users')
        .select('id')
        .eq('role_id', id)
        .limit(1);

      if (usersWithRole && usersWithRole.length > 0) {
        return ResponseHelper.error(reply, 'Cannot delete role that is assigned to users', 409);
      }

      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return ResponseHelper.success(reply, null, 'Role deleted successfully');
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });
}
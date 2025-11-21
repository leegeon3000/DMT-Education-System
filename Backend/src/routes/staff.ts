import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { supabase } from '../server';
import { ResponseHelper } from '../utils/response';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth';
import { validateBody, validateParams, validateQuery, PaginationSchema, IdParamSchema } from '../middleware/validation';

const CreateStaffSchema = z.object({
  // User info
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(1),
  phone: z.string().optional(),
  address: z.string().optional(),
  birth_date: z.string().optional(),
  
  // Staff specific info
  staff_code: z.string().optional(),
  department: z.string().max(120).optional(),
  position: z.string().max(120).optional(),
});

const UpdateStaffSchema = z.object({
  // User info updates
  email: z.string().email().optional(),
  full_name: z.string().min(1).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  birth_date: z.string().optional(),
  status: z.boolean().optional(),
  
  // Staff specific updates
  staff_code: z.string().optional(),
  department: z.string().max(120).optional(),
  position: z.string().max(120).optional(),
});

const StaffQuerySchema = PaginationSchema.extend({
  department: z.string().optional(),
  status: z.coerce.boolean().optional(),
});

export async function staffRoutes(app: FastifyInstance) {
  // GET /staff - List staff with filters
  app.get('/staff', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])],
    preHandler: [validateQuery(StaffQuerySchema)]
  }, async (req: any, reply: any) => {
    try {
      const { page, limit, search, department, status } = req.query;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('staff')
        .select(`
          *,
          users!inner(
            id, email, full_name, phone, address, birth_date, status, created_at
          )
        `, { count: 'exact' })
        .range(offset, offset + limit - 1)
        .order('id');

      if (search) {
        query = query.or(`users.full_name.ilike.%${search}%,users.email.ilike.%${search}%,staff_code.ilike.%${search}%`);
      }

      if (department) {
        query = query.eq('department', department);
      }

      if (status !== undefined) {
        query = query.eq('users.status', status);
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

  // GET /staff/:id - Get staff details
  app.get('/staff/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('staff')
        .select(`
          *,
          users!inner(
            id, email, full_name, phone, address, birth_date, avatar_url, status, created_at, updated_at
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) {
        return ResponseHelper.notFound(reply, 'Staff member not found');
      }

      return ResponseHelper.success(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // POST /staff - Create new staff
  app.post('/staff', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])],
    preHandler: [validateBody(CreateStaffSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { email, password, full_name, phone, address, birth_date, staff_code, department, position } = req.body;

      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        return ResponseHelper.badRequest(reply, 'Email already exists');
      }

      // Get STAFF role_id
      const { data: staffRole } = await supabase
        .from('roles')
        .select('id')
        .eq('code', 'STAFF')
        .single();

      if (!staffRole) {
        return ResponseHelper.serverError(reply, 'Staff role not found');
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);

      // Create user
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([{
          role_id: staffRole.id,
          email,
          password_hash,
          full_name,
          phone,
          address,
          birth_date,
          status: true
        }])
        .select()
        .single();

      if (userError) throw userError;

      // Create staff record
      const { data: newStaff, error: staffError } = await supabase
        .from('staff')
        .insert([{
          user_id: newUser.id,
          staff_code: staff_code || `STAFF${String(newUser.id).padStart(4, '0')}`,
          department,
          position
        }])
        .select()
        .single();

      if (staffError) throw staffError;

      return ResponseHelper.created(reply, {
        ...newStaff,
        user: newUser
      });
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // PUT /staff/:id - Update staff
  app.put('/staff/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])],
    preHandler: [validateParams(IdParamSchema), validateBody(UpdateStaffSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      const { email, full_name, phone, address, birth_date, status, staff_code, department, position } = req.body;

      // Get staff with user_id
      const { data: existingStaff } = await supabase
        .from('staff')
        .select('user_id')
        .eq('id', id)
        .single();

      if (!existingStaff) {
        return ResponseHelper.notFound(reply, 'Staff member not found');
      }

      // Update user info if provided
      if (email || full_name || phone || address || birth_date || status !== undefined) {
        const userUpdate: any = {};
        if (email) userUpdate.email = email;
        if (full_name) userUpdate.full_name = full_name;
        if (phone) userUpdate.phone = phone;
        if (address) userUpdate.address = address;
        if (birth_date) userUpdate.birth_date = birth_date;
        if (status !== undefined) userUpdate.status = status;

        const { error: userError } = await supabase
          .from('users')
          .update(userUpdate)
          .eq('id', existingStaff.user_id);

        if (userError) throw userError;
      }

      // Update staff info if provided
      if (staff_code || department || position) {
        const staffUpdate: any = {};
        if (staff_code) staffUpdate.staff_code = staff_code;
        if (department) staffUpdate.department = department;
        if (position) staffUpdate.position = position;

        const { data: updatedStaff, error: staffError } = await supabase
          .from('staff')
          .update(staffUpdate)
          .eq('id', id)
          .select(`
            *,
            users!inner(*)
          `)
          .single();

        if (staffError) throw staffError;

        return ResponseHelper.success(reply, updatedStaff);
      }

      // If only user fields were updated, fetch and return complete data
      const { data: updatedData } = await supabase
        .from('staff')
        .select(`
          *,
          users!inner(*)
        `)
        .eq('id', id)
        .single();

      return ResponseHelper.success(reply, updatedData);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // DELETE /staff/:id - Delete staff
  app.delete('/staff/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      // Get staff user_id
      const { data: staff } = await supabase
        .from('staff')
        .select('user_id')
        .eq('id', id)
        .single();

      if (!staff) {
        return ResponseHelper.notFound(reply, 'Staff member not found');
      }

      // Delete staff (will cascade delete user due to FK)
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return ResponseHelper.success(reply, { message: 'Staff member deleted successfully' });
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // GET /staff/departments - Get list of departments
  app.get('/staff/departments', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])],
  }, async (req: any, reply: any) => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('department')
        .not('department', 'is', null);

      if (error) throw error;

      // Get unique departments
      const departments = [...new Set(data?.map((s: any) => s.department).filter(Boolean))];

      return ResponseHelper.success(reply, departments);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });
}

import { FastifyPluginAsync } from 'fastify';
import * as sql from 'mssql';

const staffSqlServerRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /staff - List all staff members
  fastify.get('/staff', async (request, reply) => {
    try {
      const pool = await sql.connect(fastify.config.SQLSERVER_CONFIG);
      
      const result = await pool.request().query(`
        SELECT 
          s.ID,
          s.USER_ID,
          s.STAFF_CODE,
          s.DEPARTMENT,
          s.POSITION,
          s.CREATED_AT,
          u.full_name,
          u.email,
          u.phone,
          u.status
        FROM STAFF s
        INNER JOIN USERS u ON s.USER_ID = u.ID
        ORDER BY s.CREATED_AT DESC
      `);

      fastify.log.info('Executed query', {
        text: 'SELECT staff with user info',
        duration: 0,
        rows: result.recordset.length
      });

      reply.send({
        success: true,
        data: result.recordset
      });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // GET /staff/:id - Get staff member by ID
  fastify.get('/staff/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const pool = await sql.connect(fastify.config.SQLSERVER_CONFIG);
      
      const result = await pool.request()
        .input('id', sql.Int, parseInt(id))
        .query(`
          SELECT 
            s.ID,
            s.USER_ID,
            s.STAFF_CODE,
            s.DEPARTMENT,
            s.POSITION,
            s.CREATED_AT,
            u.full_name,
            u.email,
            u.phone,
            u.status
          FROM STAFF s
          INNER JOIN USERS u ON s.USER_ID = u.ID
          WHERE s.ID = @id
        `);

      if (result.recordset.length === 0) {
        return reply.status(404).send({
          success: false,
          error: 'Staff member not found'
        });
      }

      reply.send({
        success: true,
        data: result.recordset[0]
      });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error'
      });
    }
  });
};

export default staffSqlServerRoutes;

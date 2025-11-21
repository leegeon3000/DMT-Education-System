import sql from 'mssql';
import * as dotenv from 'dotenv';

dotenv.config();

// Database connection pool
let pool: sql.ConnectionPool | null = null;

// SQL Server configuration
interface DatabaseConfig {
  user: string;
  password: string;
  server: string;
  database: string;
  port?: number;
  options?: {
    encrypt?: boolean;
    trustServerCertificate?: boolean;
    enableArithAbort?: boolean;
  };
  pool?: {
    max?: number;
    min?: number;
    idleTimeoutMillis?: number;
  };
}

export async function initializeDatabase() {
  const server = process.env.DB_SERVER || process.env.SQL_SERVER;
  const database = process.env.DB_DATABASE || process.env.SQL_DATABASE;
  const user = process.env.DB_USER || process.env.SQL_USER;
  const password = process.env.DB_PASSWORD || process.env.SQL_PASSWORD;
  const port = parseInt(process.env.DB_PORT || process.env.SQL_PORT || '1433');

  if (!server || !database || !user || !password) {
    console.warn('SQL Server connection parameters not found in environment variables');
    console.warn('Required: DB_SERVER, DB_DATABASE, DB_USER, DB_PASSWORD');
    return null;
  }

  const config: any = {
    user,
    password,
    server,
    database,
    port,
    options: {
      encrypt: process.env.DB_ENCRYPT === 'true', // Use encryption for Azure
      trustServerCertificate: process.env.DB_TRUST_CERT !== 'false', // True for local dev
      enableArithAbort: true,
    },
    pool: {
      max: 20, // Maximum number of connections in the pool
      min: 0,
      idleTimeoutMillis: 30000,
    },
  };

  try {
    pool = new sql.ConnectionPool(config);
    
    pool.on('error', (err) => {
      console.error('SQL Server pool error:', err);
    });

    // Connect to the pool and wait for it
    await pool.connect();
    console.log('SQL Server connection pool initialized');
    console.log(`Connected to: ${server}/${database}`);

    return pool;
  } catch (error) {
    console.error('Error initializing SQL Server pool:', error);
    pool = null;
    return null;
  }
}

export function getPool(): sql.ConnectionPool | null {
  return pool;
}

// Helper interface for query results (compatible with both PostgreSQL and SQL Server)
export interface QueryResult {
  recordset: any[];
  recordsets: any[][];
  rowsAffected: number[];
  output: any;
  rows: any[]; // PostgreSQL compatibility
  rowCount: number; // PostgreSQL compatibility
}

// Helper function to execute queries with error handling
export async function query(text: string, params?: any[]): Promise<QueryResult> {
  if (!pool) {
    throw new Error('Database pool not initialized');
  }

  const start = Date.now();
  try {
    // Convert PostgreSQL-style parameters ($1, $2) to SQL Server style (@p1, @p2)
    let sqlQuery = text;
    if (params && params.length > 0) {
      params.forEach((_, index) => {
        sqlQuery = sqlQuery.replace(new RegExp(`\\$${index + 1}`, 'g'), `@p${index + 1}`);
      });
    }

    const request = pool.request();
    
    // Add parameters to request
    if (params && params.length > 0) {
      params.forEach((param, index) => {
        request.input(`p${index + 1}`, param);
      });
    }

    const result = await request.query(sqlQuery);
    const duration = Date.now() - start;
    
    console.log('Executed query', { 
      text: sqlQuery.substring(0, 100), 
      duration, 
      rows: result.rowsAffected[0] || result.recordset?.length || 0 
    });

    // Return result in PostgreSQL-compatible format
    return {
      recordset: result.recordset || [],
      recordsets: result.recordsets || [],
      rowsAffected: result.rowsAffected,
      output: result.output,
      // Add PostgreSQL-style properties for backward compatibility
      rows: result.recordset || [],
      rowCount: result.rowsAffected[0] || result.recordset?.length || 0,
    } as any;
  } catch (error) {
    console.error('SQL Server query error:', { text, error });
    throw error;
  }
}

// Helper function to get a request object for transactions
export async function getClient() {
  if (!pool) {
    throw new Error('Database pool not initialized');
  }
  const transaction = new sql.Transaction(pool);
  await transaction.begin();
  return transaction;
}

// Close the pool (for graceful shutdown)
export async function closePool() {
  if (pool) {
    await pool.close();
    console.log('SQL Server pool closed');
    pool = null;
  }
}

// Helper function to execute stored procedures
export interface ProcedureParams {
  input?: Record<string, any>;
  output?: Record<string, any>; // { paramName: sqlType }
}

export interface ProcedureResult {
  returnValue: number;
  output: Record<string, any>;
  recordsets: any[][];
  recordset: any[];
}

export async function executeProcedure(
  procedureName: string,
  params: ProcedureParams = {}
): Promise<ProcedureResult> {
  if (!pool) {
    throw new Error('Database pool not initialized');
  }

  const start = Date.now();
  try {
    const request = pool.request();

    // Add input parameters
    if (params.input) {
      Object.entries(params.input).forEach(([key, value]) => {
        request.input(key, value);
      });
    }

    // Add output parameters
    if (params.output) {
      Object.entries(params.output).forEach(([key, sqlType]) => {
        request.output(key, sqlType);
      });
    }

    const result = await request.execute(procedureName);
    const duration = Date.now() - start;

    console.log('Executed procedure', {
      name: procedureName,
      duration,
      returnValue: result.returnValue,
      rowCount: result.recordset?.length || 0,
    });

    return {
      returnValue: result.returnValue,
      output: result.output,
      recordsets: Array.isArray(result.recordsets) ? result.recordsets : [result.recordset || []],
      recordset: result.recordset || [],
    };
  } catch (error) {
    console.error('Stored procedure error:', { procedureName, error });
    throw error;
  }
}

// Export sql for direct use in routes if needed
export { sql };

import sql from 'mssql';

export interface Cryptogram {
  id: number;
  puzzle: string;
  solution: string;
  explanation?: string;
  source: 'USER_SUBMITTED' | 'AI_GENERATED' | 'OFFICIAL';
  difficulty: number;
  date_added: Date;
}

export interface CryptogramInput {
  puzzle: string;
  solution: string;
  explanation?: string;
  source: 'USER_SUBMITTED' | 'AI_GENERATED' | 'OFFICIAL';
  difficulty: number;
  date_added: Date;
}

const config: sql.config = {
  server: process.env.DB_SERVER || '',
  database: process.env.DB_NAME || 'cryptics',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

let pool: sql.ConnectionPool;

async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = new sql.ConnectionPool(config);
    await pool.connect();
  }
  return pool;
}

export class DatabaseService {
  static async getAllCryptograms(): Promise<Cryptogram[]> {
    const pool = await getPool();
    const result = await pool.request().query(
      'SELECT * FROM cryptograms ORDER BY date_added DESC'
    );
    return result.recordset.map((row: any) => ({
      ...row,
      date_added: new Date(row.date_added)
    }));
  }

  static async getCryptogramById(id: number): Promise<Cryptogram | null> {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM cryptograms WHERE id = @id');
    
    if (result.recordset.length === 0) return null;
    return {
      ...result.recordset[0],
      date_added: new Date(result.recordset[0].date_added)
    };
  }

  static async getLatestCryptogram(): Promise<Cryptogram | null> {
    const pool = await getPool();
    const result = await pool.request().query(
      'SELECT TOP 1 * FROM cryptograms ORDER BY date_added DESC'
    );
    if (result.recordset.length === 0) return null;
    return {
      ...result.recordset[0],
      date_added: new Date(result.recordset[0].date_added)
    };
  }

  static async getLatestCryptograms(page: number = 1, limit: number = 20): Promise<Cryptogram[]> {
    const offset = (page - 1) * limit;
    const pool = await getPool();
    const result = await pool.request()
      .input('limit', sql.Int, limit)
      .input('offset', sql.Int, offset)
      .query('SELECT * FROM cryptograms ORDER BY date_added DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY');
    
    return result.recordset.map((row: any) => ({
      ...row,
      date_added: new Date(row.date_added)
    }));
  }

  static async createCryptogram(cryptogram: CryptogramInput): Promise<Cryptogram> {
    const pool = await getPool();
    const result = await pool.request()
      .input('puzzle', sql.NVarChar(sql.MAX), cryptogram.puzzle)
      .input('solution', sql.NVarChar(sql.MAX), cryptogram.solution)
      .input('explanation', sql.NVarChar(sql.MAX), cryptogram.explanation)
      .input('source', sql.VarChar(20), cryptogram.source)
      .input('difficulty', sql.Int, cryptogram.difficulty)
      .input('date_added', sql.DateTime2, cryptogram.date_added)
      .query(`
        INSERT INTO cryptograms (puzzle, solution, explanation, source, difficulty, date_added) 
        OUTPUT INSERTED.* 
        VALUES (@puzzle, @solution, @explanation, @source, @difficulty, @date_added)
      `);
    
    return {
      ...result.recordset[0],
      date_added: new Date(result.recordset[0].date_added)
    };
  }
}
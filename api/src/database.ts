import { Pool, PoolClient } from 'pg';

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

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'cryptics',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

let pool: Pool;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool(config);
  }
  return pool;
}

export class DatabaseService {
  static async getAllCryptograms(): Promise<Cryptogram[]> {
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM cryptograms ORDER BY date_added DESC'
    );
    return result.rows.map((row: any) => ({
      ...row,
      date_added: new Date(row.date_added)
    }));
  }

  static async getCryptogramById(id: number): Promise<Cryptogram | null> {
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM cryptograms WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) return null;
    return {
      ...result.rows[0],
      date_added: new Date(result.rows[0].date_added)
    };
  }

  static async getLatestCryptogram(): Promise<Cryptogram | null> {
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM cryptograms ORDER BY date_added DESC LIMIT 1'
    );
    if (result.rows.length === 0) return null;
    return {
      ...result.rows[0],
      date_added: new Date(result.rows[0].date_added)
    };
  }

  static async getLatestCryptograms(page: number = 1, limit: number = 20): Promise<Cryptogram[]> {
    const offset = (page - 1) * limit;
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM cryptograms ORDER BY date_added DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    return result.rows.map((row: any) => ({
      ...row,
      date_added: new Date(row.date_added)
    }));
  }

  static async createCryptogram(cryptogram: CryptogramInput): Promise<Cryptogram> {
    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO cryptograms (puzzle, solution, explanation, source, difficulty, date_added) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [
        cryptogram.puzzle,
        cryptogram.solution,
        cryptogram.explanation,
        cryptogram.source,
        cryptogram.difficulty,
        cryptogram.date_added
      ]
    );
    
    return {
      ...result.rows[0],
      date_added: new Date(result.rows[0].date_added)
    };
  }

  static async deleteCryptogram(id: number): Promise<boolean> {
    const pool = getPool();
    const result = await pool.query(
      'DELETE FROM cryptograms WHERE id = $1 RETURNING id',
      [id]
    );
    
    return result.rows.length > 0;
  }
}
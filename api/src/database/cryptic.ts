import { getPool } from './init.js';
import { type Cryptogram, type CryptogramInput } from '../types/crypticTypes.js';

export class CrypticDatabaseService {
	static async getAllCryptograms(): Promise<Cryptogram[]> {
		const pool = getPool();
		const result = await pool.query(
			'SELECT * FROM cryptograms WHERE hidden = FALSE ORDER BY date_added DESC'
		);
		return result.rows.map((row: any) => ({
			...row,
			date_added: new Date(row.date_added)
		}));
	}

	static async getCryptogramById(id: number): Promise<Cryptogram | null> {
		const pool = getPool();
		const result = await pool.query(
			'SELECT * FROM cryptograms WHERE id = $1 AND hidden = FALSE',
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
			`SELECT * FROM cryptograms 
			WHERE hidden = FALSE 
			ORDER BY 
			  CASE 
			    WHEN (date_added AT TIME ZONE 'America/Los_Angeles')::date = (NOW() AT TIME ZONE 'America/Los_Angeles')::date THEN 0 
			    ELSE 1 
			  END,
			  id DESC 
			LIMIT 1`
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
			`SELECT * FROM cryptograms 
			WHERE hidden = FALSE 
			  AND (date_added AT TIME ZONE 'America/Los_Angeles')::date <= (NOW() AT TIME ZONE 'America/Los_Angeles')::date
			ORDER BY date_added DESC, id DESC
			LIMIT $1 OFFSET $2`,
			[limit, offset]
		);

		return result.rows.map((row: any) => ({
			...row,
			date_added: new Date(row.date_added)
		}));
	}

	static async createCryptogram(cryptogram: CryptogramInput): Promise<Cryptogram> {
		const pool = getPool();

		// Get the latest puzzle's date
		const latestResult = await pool.query(
			'SELECT date_added FROM cryptograms ORDER BY date_added DESC LIMIT 1'
		);

		// Calculate the new date: one day after the latest puzzle
		let newDate: Date;
		if (latestResult.rows.length === 0) {
			// No puzzles exist, use current date
			newDate = new Date();
		} else {
			// Add one day to the latest puzzle's date
			newDate = new Date(latestResult.rows[0].date_added);
			newDate.setDate(newDate.getDate() + 1);
		}

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
				newDate
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
			'UPDATE cryptograms SET hidden = TRUE WHERE id = $1 AND hidden = FALSE RETURNING id',
			[id]
		);

		return result.rows.length > 0;
	}
}
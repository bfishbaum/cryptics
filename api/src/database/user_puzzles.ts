import { getPool } from './init.js';
import { type Cryptogram, type CryptogramInput } from '../types/crypticTypes.js';

export class UserPuzzleDatabaseService {
	static async getUserPuzzleById(id: number): Promise<Cryptogram | null> {
		const pool = getPool();
		const result = await pool.query(
			'SELECT * FROM user_puzzles WHERE id = $1 AND hidden = FALSE',
			[id]
		);

		if (result.rows.length === 0) return null;
		return {
			...result.rows[0],
			date_added: new Date(result.rows[0].date_added)
		};
	}

	static async getLatestUserPuzzles(page: number = 1, limit: number = 20): Promise<Cryptogram[]> {
		const offset = (page - 1) * limit;
		const pool = getPool();
		const result = await pool.query(
			'SELECT * FROM user_puzzles WHERE hidden = FALSE and private = FALSE ORDER BY date_added DESC LIMIT $1 OFFSET $2',
			[limit, offset]
		);

		return result.rows.map((row: any) => ({
			...row,
			date_added: new Date(row.date_added)
		}));
	}

	static async getUserPuzzlesByUser(page: number = 1, limit: number = 20, user_id: string): Promise<Cryptogram[]> {
		const offset = (page - 1) * limit;
		const pool = getPool();
		const result = await pool.query(
			'SELECT * FROM user_puzzles WHERE hidden = FALSE and private = FALSE and creator_id = $3 ORDER BY date_added DESC LIMIT $1 OFFSET $2',
			[limit, offset, user_id]
		);

		return result.rows.map((row: any) => ({
			...row,
			date_added: new Date(row.date_added)
		}));
	}


	static async createUserPuzzle(cryptogram: CryptogramInput, user_id: string, display_name: string): Promise<Cryptogram> {
		const pool = getPool();
		const result = await pool.query(
			`INSERT INTO cryptograms (creator_id, puzzle, solution, explanation, creator_name, source, difficulty, date_added, private) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
			[
				user_id,
				cryptogram.puzzle,
				cryptogram.solution,
				cryptogram.explanation,
				display_name,
				cryptogram.source,
				cryptogram.difficulty,
				cryptogram.date_added,
				cryptogram.private
			]
		);

		return {
			...result.rows[0],
			date_added: new Date(result.rows[0].date_added)
		};
	}

	static async updateDisplayNames(user_id: string, new_name: string): Promise<boolean> {
		const pool = getPool();
		const result = await pool.query(
			'UPDATE cryptograms SET creator_name = $2 WHERE creator_id = $1',
			[user_id, new_name]
		);

		return result.rows.length > 0;
	}

	static async deleteUserPuzzle(id: number, user_id:number): Promise<boolean> {
		const pool = getPool();
		const result = await pool.query(
			'UPDATE cryptograms SET hidden = TRUE WHERE id = $1 AND hidden = FALSE and creator_id = $2 RETURNING id',
			[id, user_id]
		);

		return result.rows.length > 0;
	}
}
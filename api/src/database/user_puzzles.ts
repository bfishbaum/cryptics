import { getPool } from './init.js';
import { type Cryptogram, type CryptogramInput } from '../types/crypticTypes.js';
import { sanitizePuzzleText, sanitizeExplanation, sanitizeDisplayName } from '../utils/sanitization.js';

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
			date_added: new Date(result.rows[0].created_at)
		};
	}

	static async getLatestUserPuzzles(page: number = 1, limit: number = 20): Promise<Cryptogram[]> {
		const offset = (page - 1) * limit;
		const pool = getPool();
		const result = await pool.query(
			'SELECT * FROM user_puzzles WHERE hidden = FALSE and private = FALSE ORDER BY id DESC LIMIT $1 OFFSET $2',
			[limit, offset]
		);

		return result.rows.map((row: any) => ({
			...row,
			date_added: new Date(row.created_at)
		}));
	}

	static async getUserPuzzlesByUser(page: number = 1, limit: number = 20, user_id: string): Promise<Cryptogram[]> {
		const offset = (page - 1) * limit;
		const pool = getPool();
		const result = await pool.query(
			'SELECT * FROM user_puzzles WHERE hidden = FALSE and private = FALSE and creator_id = $3 ORDER BY created_at DESC LIMIT $1 OFFSET $2',
			[limit, offset, user_id]
		);

		return result.rows.map((row: any) => ({
			...row,
			date_added: new Date(row.created_at)
		}));
	}

	static async getAllUserPuzzlesByUser(user_id: string): Promise<Cryptogram[]> {
		const pool = getPool();
		const result = await pool.query(
			'SELECT * FROM user_puzzles WHERE creator_id = $1 ORDER BY created_at DESC',
			[user_id]
		);

		return result.rows.map((row: any) => ({
			...row,
			date_added: new Date(row.created_at)
		}));
	}


	static async createUserPuzzle(cryptogram: CryptogramInput, user_id: string, display_name: string): Promise<Cryptogram> {
		const pool = getPool();

		// Sanitize all user inputs to prevent XSS
		const sanitizedPuzzle = sanitizePuzzleText(cryptogram.puzzle);
		const sanitizedSolution = sanitizePuzzleText(cryptogram.solution);
		const sanitizedExplanation = cryptogram.explanation ? sanitizeExplanation(cryptogram.explanation) : null;
		const sanitizedDisplayName = sanitizeDisplayName(display_name);

		const result = await pool.query(
			`INSERT INTO user_puzzles (creator_id, puzzle, solution, explanation, creator_name, difficulty, private)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
			[
				user_id,
				sanitizedPuzzle,
				sanitizedSolution,
				sanitizedExplanation,
				sanitizedDisplayName,
				cryptogram.difficulty,
				false // New puzzles are public by default
			]
		);

		return {
			...result.rows[0],
			date_added: new Date(result.rows[0].created_at)
		};
	}

	static async updateDisplayNames(user_id: string, new_name: string): Promise<boolean> {
		const pool = getPool();
		const sanitizedName = sanitizeDisplayName(new_name);
		const result = await pool.query(
			'UPDATE user_puzzles SET creator_name = $2 WHERE creator_id = $1',
			[user_id, sanitizedName]
		);

		return result.rowCount > 0;
	}

	static async deleteUserPuzzle(id: number, user_id:number): Promise<boolean> {
		const pool = getPool();
		const result = await pool.query(
			'UPDATE user_puzzles SET hidden = TRUE WHERE id = $1 AND hidden = FALSE and creator_id = $2 RETURNING id',
			[id, user_id]
		);

		return result.rows.length > 0;
	}

	static async deleteUserPuzzleAdmin(id: number): Promise<boolean> {
		console.log('Admin deleting puzzle', id);
		const pool = getPool();
		const result = await pool.query(
			'UPDATE user_puzzles SET hidden = TRUE WHERE id = $1 AND hidden = FALSE RETURNING id',
			[id]
		);

		return result.rows.length > 0;
	}
}
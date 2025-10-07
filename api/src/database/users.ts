import { getPool } from './init.js';
import { type Cryptogram, type CryptogramInput } from '../types/crypticTypes.js';
import { UserPuzzleDatabaseService } from './user_puzzles.js';

export class UserDatabaseService {
	// This should only be hit by the Auth0 post-login hook
	// We are going to use a shared secret to secure this endpoint
	static async userPostLoginAddToDb(event): Promise<boolean> {
		const pool = getPool();
		const user_id = event.user.user_id;
		const display_name = event.user.nickname || 'Anonymous';
		const existingUser = await pool.query(
			`SELECT * FROM users WHERE id = $1`,
			[user_id]
		);
		if (existingUser.rows.length > 0) {
			await pool.query(
				`INSERT INTO users (id, display_name)
				VALUES ($1, $2) returning *`,
				[user_id, display_name]
			);
			return true;
		}
		return true;
	}

	static async getDisplayNameByUserId(user_id: string): Promise<string | null> {
		const pool = getPool();
		const result = await pool.query(
			'SELECT display_name FROM users WHERE id = $1',
			[user_id]
		);
		
		if (result.rows.length === 0) return null;
		return result.rows[0].display_name;
	}

	static async getUserById(user_id: string): Promise<{ id: string; display_name: string } | null> {
		const pool = getPool();
		const result = await pool.query(
			`SELECT id, display_name FROM users WHERE id = $1`,
			[user_id]
		);

		if (result.rows.length === 0) {
			return null;
		}

		return result.rows[0];
	}

	private static generateDefaultDisplayName(): string {
		const random = Math.random().toString(36).substring(2, 8);
		return `puzzleperson${random}`;
	}

	static async ensureUserExistsWithDefault(user_id: string): Promise<string> {
		const pool = getPool();
		const existingUser = await pool.query(
			`SELECT display_name FROM users WHERE id = $1`,
			[user_id]
		);

		if (existingUser.rows.length > 0) {
			return existingUser.rows[0].display_name;
		}

		const defaultDisplayName = UserDatabaseService.generateDefaultDisplayName();
		const inserted = await pool.query(
			`INSERT INTO users (id, display_name) VALUES ($1, $2) RETURNING display_name`,
			[user_id, defaultDisplayName]
		);
		return inserted.rows[0].display_name;
	}

	static async editDisplayName(user_id: string, new_name: string): Promise<boolean> {
		const pool = getPool();
		const trimmedName = new_name.trim();
		const existingUser = await pool.query(
			`SELECT id FROM users WHERE id = $1`,
			[user_id]
		);

		if (existingUser.rows.length > 0) {
			await pool.query(
				`UPDATE users SET display_name = $1 WHERE id = $2`,
				[trimmedName, user_id]
			);
		} else {
			await pool.query(
				`INSERT INTO users (id, display_name) VALUES ($1, $2)`,
				[user_id, trimmedName]
			);
		}

		await UserPuzzleDatabaseService.updateDisplayNames(user_id, trimmedName);
		return true;
	}
}
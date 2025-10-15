import type { Cryptogram, CryptogramInput } from '../types/cryptogram';

const USER_PUZZLE_API_BASE_URL = import.meta.env.VITE_API_URL + '/api/userpuzzles';

export class UserPuzzleDatabaseService {
  static async getAllUserPuzzles(): Promise<Cryptogram[]> {
    const response = await fetch(`${USER_PUZZLE_API_BASE_URL}/puzzles`);
    if (!response.ok) {
      throw new Error('Failed to fetch cryptograms');
    }
    const data = await response.json();
    return data.map((item: Cryptogram) => ({
      ...item,
    }));
  }

  static async getUserPuzzleById(id: number): Promise<Cryptogram | null> {
    const response = await fetch(`${USER_PUZZLE_API_BASE_URL}/puzzles/${id}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error('Failed to fetch cryptogram');
    }
    const data = await response.json();
    return {
      ...data,
    };
  }

  static async getLatestUserPuzzles(page: number = 1, limit: number = 20): Promise<Cryptogram[]> {
    const response = await fetch(`${USER_PUZZLE_API_BASE_URL}/puzzles/paginated?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch cryptograms');
    }
    const data = await response.json();
    return data.map((item: Cryptogram) => ({
      ...item,
    }));
  }

  static async createUserPuzzle(cryptogram: CryptogramInput, accessToken: string): Promise<Cryptogram> {
    const response = await fetch(`${USER_PUZZLE_API_BASE_URL}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ "puzzle": cryptogram }),
    });
    if (!response.ok) {
      throw new Error('Failed to create cryptogram');
    }
    const data = await response.json();
    return {
      ...data,
    };
  }

  static async deleteUserPuzzle(id: number, accessToken: string): Promise<void> {
    const response = await fetch(`${USER_PUZZLE_API_BASE_URL}/puzzles/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.status === 404) {
      throw new Error('User submitted puzzle not found');
    }

    if (!response.ok) {
      throw new Error('Failed to delete user submitted puzzle');
    }
  }

  static async deleteUserPuzzleAdmin(id: number, accessToken: string): Promise<void> {
    const response = await fetch(`${USER_PUZZLE_API_BASE_URL}/admin/puzzles/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.status === 404) {
      throw new Error('User submitted puzzle not found');
    }

    if (response.status === 403) {
      throw new Error('Insufficient permissions - admin access required');
    }

    if (!response.ok) {
      throw new Error('Failed to delete user submitted puzzle');
    }
  }
}
import type { Cryptogram, CryptogramInput } from '../types/cryptogram';

const USER_PUZZLE_API_BASE_URL = import.meta.env.VITE_API_URL + '/api/userpuzzles';

export class UserPuzzleDatabaseService {
//   static async getAllUserPuzzles(): Promise<Cryptogram[]> {
//     const response = await fetch(`${USER_PUZZLE_API_BASE_URL}/puzzles`);
//     if (!response.ok) {
//       throw new Error('Failed to fetch cryptograms');
//     }
//     const data = await response.json();
//     return data.map((item: Cryptogram) => ({
//       ...item,
//       date_added: new Date(item.date_added)
//     }));
//   }

  static async createUserPuzzle(cryptogram: CryptogramInput, accessToken: string): Promise<Cryptogram> {
    const response = await fetch(`${USER_PUZZLE_API_BASE_URL}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(cryptogram),
    });
    if (!response.ok) {
      throw new Error('Failed to create cryptogram');
    }
    const data = await response.json();
    return {
      ...data,
      date_added: new Date(data.date_added)
    };
  }

//   static async deleteCryptogram(id: number, accessToken: string): Promise<void> {
//     const response = await fetch(`${USER_PUZZLE_API_BASE_URL}/cryptograms/${id}`, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${accessToken}`
//       }
//     });
//     if (response.status === 404) {
//       throw new Error('Cryptogram not found');
//     }
//     if (!response.ok) {
//       throw new Error('Failed to delete cryptogram');
//     }
//   }
}
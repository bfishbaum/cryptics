import type { Cryptogram, CryptogramInput } from '../types/cryptogram';

const CRYPTIC_API_BASE_URL = import.meta.env.VITE_API_URL + '/api/cryptics';

export class CrypticDatabaseService {
  static async getAllCryptograms(): Promise<Cryptogram[]> {
    const response = await fetch(`${CRYPTIC_API_BASE_URL}/cryptograms`);
    if (!response.ok) {
      throw new Error('Failed to fetch cryptograms');
    }
    const data = await response.json();
    return data.map((item: Cryptogram) => ({
      ...item,
      date_added: new Date(item.date_added)
    }));
  }

  static async getCryptogramById(id: number): Promise<Cryptogram | null> {
    const response = await fetch(`${CRYPTIC_API_BASE_URL}/cryptograms/${id}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error('Failed to fetch cryptogram');
    }
    const data = await response.json();
    return {
      ...data,
      date_added: new Date(data.date_added)
    };
  }

  static async getLatestCryptogram(): Promise<Cryptogram | null> {
    const response = await fetch(`${CRYPTIC_API_BASE_URL}/cryptograms/latest`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error('Failed to fetch latest cryptogram');
    }
    const data = await response.json();
    return {
      ...data,
      date_added: new Date(data.date_added)
    };
  }

  static async getLatestCryptograms(page: number = 1, limit: number = 20): Promise<Cryptogram[]> {
    const response = await fetch(`${CRYPTIC_API_BASE_URL}/cryptograms/paginated?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch cryptograms');
    }
    const data = await response.json();
    return data.map((item: Cryptogram) => ({
      ...item,
      date_added: new Date(item.date_added)
    }));
  }

  static async createCryptogram(cryptogram: CryptogramInput, accessToken: string): Promise<Cryptogram> {
    const response = await fetch(`${CRYPTIC_API_BASE_URL}/cryptograms`, {
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

  static async deleteCryptogram(id: number, accessToken: string): Promise<void> {
    const response = await fetch(`${CRYPTIC_API_BASE_URL}/cryptograms/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    if (response.status === 404) {
      throw new Error('Cryptogram not found');
    }
    if (!response.ok) {
      throw new Error('Failed to delete cryptogram');
    }
  }
}
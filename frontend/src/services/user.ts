import type { UserProfileApiResponse, UserProfileResponse } from '../types/profile';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

const buildUrl = (path: string) => {
  try {
    return new URL(path, API_BASE_URL).toString();
  } catch {
    return `${API_BASE_URL}${path}`;
  }
};

export class UserService {
  static async getProfile(accessToken: string): Promise<UserProfileResponse> {
    const response = await fetch(buildUrl('/api/users/profile'), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const message = errorBody && typeof errorBody.message === 'string'
        ? errorBody.message
        : 'Failed to fetch user profile';
      throw new Error(message);
    }

    const data = await response.json() as UserProfileApiResponse;

    const { puzzles, ...rest } = data;

    return {
      userId: rest.userId ?? '',
      displayName: rest.displayName ?? '',
      puzzles: Array.isArray(puzzles)
        ? puzzles.map((puzzle) => ({
            ...puzzle,
            date_added: new Date(puzzle.date_added)
          }))
        : []
    };
  }

  static async updateDisplayName(displayName: string, accessToken: string): Promise<string> {
    const response = await fetch(buildUrl('/api/users/displayname'), {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ displayName }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const message = errorBody && typeof errorBody.error === 'string'
        ? errorBody.error
        : 'Failed to update display name';
      throw new Error(message);
    }

    const data = await response.json();
    if (data && typeof data.displayName === 'string') {
      return data.displayName;
    }

    return displayName;
  }
}

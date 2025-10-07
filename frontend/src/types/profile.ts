import type { Cryptogram } from './cryptogram';

export interface UserProfilePuzzle extends Omit<Cryptogram, 'date_added'> {
  date_added: string;
}

export interface UserProfileApiResponse {
  userId: string;
  displayName?: string | null;
  puzzles?: UserProfilePuzzle[];
}

export interface UserProfileResponse {
  userId: string;
  displayName: string;
  puzzles: Cryptogram[];
}

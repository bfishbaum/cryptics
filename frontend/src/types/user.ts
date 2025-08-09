/**
 * User-related TypeScript types
 */

export interface User {
  id: number;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  isEmailVerified: boolean;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  preferences: UserPreferences;
  stats: UserStats;
}

export type UserRole = 'user' | 'admin' | 'moderator';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  emailNotifications: boolean;
  showHints: boolean;
  defaultDifficulty: number;
  language: string;
}

export interface UserStats {
  totalPuzzlesSolved: number;
  totalPuzzlesAttempted: number;
  averageSolveTime: number; // in milliseconds
  currentStreak: number;
  longestStreak: number;
  favoriteCategory?: string;
  totalTimeSpent: number; // in milliseconds
  difficultyBreakdown: {
    [difficulty: number]: {
      solved: number;
      attempted: number;
    };
  };
}

export interface UserProfile {
  id: number;
  username: string;
  displayName: string;
  avatar?: string;
  joinedAt: Date;
  stats: UserStats;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: AchievementCategory;
}

export type AchievementCategory = 'solving' | 'streak' | 'difficulty' | 'speed' | 'participation';

export interface UserSession {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface PublicUserProfile {
  id: number;
  username: string;
  displayName: string;
  avatar?: string;
  joinedAt: Date;
  publicStats: {
    totalPuzzlesSolved: number;
    currentStreak: number;
    longestStreak: number;
  };
  achievements: Achievement[];
}
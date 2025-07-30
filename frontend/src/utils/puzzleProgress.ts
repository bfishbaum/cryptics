/**
 * Puzzle progress management with cookie-based storage
 */

import { setFunctionalCookie, getCookie, hasConsentFor } from './cookies';

export interface PuzzleProgress {
  puzzleId: number;
  userInput: string[];
  completedAt?: number;
  lastPlayed: number;
}

const PROGRESS_COOKIE_NAME = 'cryptics-puzzle-progress';
const MAX_STORED_PUZZLES = 50; // Limit to prevent cookie from getting too large

/**
 * Save puzzle progress (only if functional cookies consent given)
 */
export function savePuzzleProgress(puzzleId: number, userInput: string[]): boolean {
  if (!hasConsentFor('functional')) {
    console.info('Puzzle progress not saved - functional cookies not allowed');
    return false;
  }

  try {
    const existingProgress = getAllPuzzleProgress();
    
    const newProgress: PuzzleProgress = {
      puzzleId,
      userInput: [...userInput],
      lastPlayed: Date.now()
    };

    // Remove existing progress for this puzzle
    const filteredProgress = existingProgress.filter(p => p.puzzleId !== puzzleId);
    
    // Add new progress and limit total stored puzzles
    const updatedProgress = [newProgress, ...filteredProgress].slice(0, MAX_STORED_PUZZLES);
    
    const progressString = JSON.stringify(updatedProgress);
    return setFunctionalCookie(PROGRESS_COOKIE_NAME, progressString, 30);
  } catch (error) {
    console.error('Failed to save puzzle progress:', error);
    return false;
  }
}

/**
 * Get puzzle progress for a specific puzzle
 */
export function getPuzzleProgress(puzzleId: number): PuzzleProgress | null {
  if (!hasConsentFor('functional')) {
    return null;
  }

  try {
    const allProgress = getAllPuzzleProgress();
    return allProgress.find(p => p.puzzleId === puzzleId) || null;
  } catch (error) {
    console.error('Failed to get puzzle progress:', error);
    return null;
  }
}

/**
 * Mark puzzle as completed
 */
export function markPuzzleCompleted(puzzleId: number, userInput: string[]): boolean {
  if (!hasConsentFor('functional')) {
    return false;
  }

  try {
    const existingProgress = getAllPuzzleProgress();
    const filteredProgress = existingProgress.filter(p => p.puzzleId !== puzzleId);
    
    const completedProgress: PuzzleProgress = {
      puzzleId,
      userInput: [...userInput],
      completedAt: Date.now(),
      lastPlayed: Date.now()
    };

    const updatedProgress = [completedProgress, ...filteredProgress].slice(0, MAX_STORED_PUZZLES);
    const progressString = JSON.stringify(updatedProgress);
    
    return setFunctionalCookie(PROGRESS_COOKIE_NAME, progressString, 30);
  } catch (error) {
    console.error('Failed to mark puzzle as completed:', error);
    return false;
  }
}

/**
 * Check if puzzle is completed
 */
export function isPuzzleCompleted(puzzleId: number): boolean {
  const progress = getPuzzleProgress(puzzleId);
  return progress?.completedAt !== undefined;
}

/**
 * Get all puzzle progress (internal helper)
 */
function getAllPuzzleProgress(): PuzzleProgress[] {
  try {
    const progressCookie = getCookie(PROGRESS_COOKIE_NAME);
    if (!progressCookie) return [];
    
    const parsed = JSON.parse(progressCookie);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to parse puzzle progress cookie:', error);
    return [];
  }
}

/**
 * Get recently played puzzles
 */
export function getRecentlyPlayedPuzzles(limit: number = 10): PuzzleProgress[] {
  if (!hasConsentFor('functional')) {
    return [];
  }

  try {
    const allProgress = getAllPuzzleProgress();
    return allProgress
      .sort((a, b) => b.lastPlayed - a.lastPlayed)
      .slice(0, limit);
  } catch (error) {
    console.error('Failed to get recently played puzzles:', error);
    return [];
  }
}

/**
 * Get completed puzzles count
 */
export function getCompletedPuzzlesCount(): number {
  if (!hasConsentFor('functional')) {
    return 0;
  }

  try {
    const allProgress = getAllPuzzleProgress();
    return allProgress.filter(p => p.completedAt !== undefined).length;
  } catch (error) {
    console.error('Failed to get completed puzzles count:', error);
    return 0;
  }
}

/**
 * Clear all puzzle progress (for privacy/reset purposes)
 */
export function clearAllPuzzleProgress(): boolean {
  try {
    return setFunctionalCookie(PROGRESS_COOKIE_NAME, '[]', 30);
  } catch (error) {
    console.error('Failed to clear puzzle progress:', error);
    return false;
  }
}
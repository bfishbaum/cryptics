import { Router } from "express";

import { UserPuzzleDatabaseService } from "../database/user_puzzles.js";
import { type Cryptogram, type CryptogramInput } from '../types/crypticTypes.js';
import { jwtCheck, checkPermissionsAny, extractUserId } from '../middleware/admin.js';
import { jwt } from "zod";
import { UserDatabaseService } from "../database/users.js";

const router = Router();
// Get all cryptograms
//s Get latest cryptogram (must come before /:id route)

router.get('/puzzles/paginated', async (req, res) => {
  const startTime = Date.now();
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  try {
    const puzzles = await UserPuzzleDatabaseService.getLatestUserPuzzles(page, limit);
    const duration = Date.now() - startTime;
    res.json(puzzles);
  } catch (error) {
    const duration = Date.now() - startTime;
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
});

router.get('/puzzles/:id', async (req, res) => {
	try {
		const puzzle_id = parseInt(req.params.id);
		const puzzle = await UserPuzzleDatabaseService.getUserPuzzleById(puzzle_id);
		if (!puzzle) {
			return res.status(404).json({ error: 'No puzzles found for that number' });
		}
		res.json(puzzle);
	} catch (error) {
		console.error('Error fetching user puzzles:', error);
		res.status(500).json({
			error: 'Internal server error',
			details: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined
		});
	}
});

router.get('/mypuzzles', jwtCheck, extractUserId, async (req, res) => {
	try {
		const user_id = req.body.user_id;
		const puzzles = await UserPuzzleDatabaseService.getUserPuzzlesByUser(1, 20, user_id);
		if (!puzzles) {
			return res.status(404).json({ error: 'No puzzles found for user' });
		}
		res.json(puzzles);
	} catch (error) {
		console.error('Error fetching user puzzles:', error);
		res.status(500).json({
			error: 'Internal server error',
			details: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined
		});
	}
});

router.post('/submit', jwtCheck, extractUserId, async (req, res) => {
	try {
		const puzzleData: CryptogramInput = req.body.puzzle;
		if (!puzzleData.puzzle || !puzzleData.solution) {
			return res.status(400).json({ error: 'Puzzle and solution are required' });
		}
		const display_name = await UserDatabaseService.ensureUserExistsWithDefault(req.body.user_id);
		const puzzle = await UserPuzzleDatabaseService.createUserPuzzle(puzzleData, req.body.user_id, display_name);
		return res.status(201).json(puzzle);
	} catch (error) {
		console.error('Error submitting puzzle:', error);
		res.status(500).json({
			error: 'Internal server error',
			details: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined
		});
	}
});

export default router;
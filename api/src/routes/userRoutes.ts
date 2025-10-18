import { Router } from "express";

import { UserDatabaseService } from "../database/users.js";
import { UserPuzzleDatabaseService } from "../database/user_puzzles.js";
import { jwtCheck, checkAuth0ApiSecret, extractUserId } from '../middleware/admin.js';
import { type UserProfile } from "../types/crypticTypes.js";

const router = Router();
// Get all cryptograms
router.get('/postlogin', checkAuth0ApiSecret, async (req, res) => {
	const response = await UserDatabaseService.userPostLoginAddToDb(req);
	res.status(response ? 200 : 500).json({ success: response });
});

router.put('/displayname', jwtCheck, extractUserId, async (req, res) => {
	try {
		const { displayName } = req.body;
		const userId = req.body.user_id as string | undefined;

		if (!userId) {
			return res.status(401).json({ error: 'Unauthorized: missing user context' });
		}

		if (typeof displayName !== 'string' || displayName.trim().length === 0) {
			return res.status(400).json({ error: 'Display name is required' });
		}

		const sanitizedDisplayName = displayName.trim();
		const success = await UserDatabaseService.editDisplayName(userId, sanitizedDisplayName);
		if (!success) {
			return res.status(500).json({ error: 'Unable to update display name' });
		}

		return res.status(200).json({ success: true, displayName: sanitizedDisplayName });
	} catch (error) {
		console.error('Error updating display name:', error);
		return res.status(500).json({
			error: 'Internal server error',
			details: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined
		});
	}
});

router.get('/profile', jwtCheck, extractUserId, async (req, res) => {
	try {
		const userId = req.body.user_id as string | undefined;

		if (!userId) {
			return res.status(401).json({ error: 'Unauthorized: missing user context' });
		}

		let existingUser = await UserDatabaseService.getUserById(userId);
		const puzzles = await UserPuzzleDatabaseService.getAllUserPuzzlesByUser(userId);

		if (!existingUser) {
			const defaultDisplayName = await UserDatabaseService.createUserWithDefaultDisplayName(userId);
			existingUser = {
				id: userId,
				display_name: defaultDisplayName
			};
		}

		const profile: UserProfile = {
			userId,
			displayName: existingUser.display_name,
			puzzles
		};

		return res.status(200).json(profile);
	} catch (error) {
		console.error('Error fetching user profile:', error);
		return res.status(500).json({
			error: 'Internal server error',
			details: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined
		});
	}
});

router.get('/profile/:userId', jwtCheck, async (req, res) => {
	try {
		const { userId } = req.params;

		if (!userId) {
			return res.status(400).json({ error: 'User ID is required' });
		}

		const existingUser = await UserDatabaseService.getUserById(userId);

		if (!existingUser) {
			return res.status(404).json({ error: 'User not found' });
		}

		const puzzles = await UserPuzzleDatabaseService.getPublicUserPuzzlesByUser(userId);

		const profile: UserProfile = {
			userId,
			displayName: existingUser.display_name,
			puzzles
		};

		return res.status(200).json(profile);
	} catch (error) {
		console.error('Error fetching user profile:', error);
		return res.status(500).json({
			error: 'Internal server error',
			details: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined
		});
	}
});

export default router;

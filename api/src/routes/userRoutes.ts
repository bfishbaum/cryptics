import { Router } from "express";

import { UserDatabaseService } from "../database/users.js";
import { jwtCheck, checkPermissionsAny, checkAuth0ApiSecret } from '../middleware/admin.js';

const router = Router();
// Get all cryptograms
router.get('/postlogin', checkAuth0ApiSecret, async (req, res) => {
	const response = await UserDatabaseService.userPostLoginAddToDb(req);
	res.status(response ? 200 : 500).json({ success: response });
});

export default router;
import { Request, Response, NextFunction } from 'express';
import { auth, requiredScopes } from 'express-oauth2-jwt-bearer';

export const jwtCheck = auth({
	audience: 'cryptic_api_id',
	issuerBaseURL: 'https://dev-l01xcafdoui0qywg.us.auth0.com/',
	tokenSigningAlg: 'RS256'
});

export const deletePosts = requiredScopes('delete:cryptic');
export const writePosts = requiredScopes('write:new_cryptic');

export const checkPermissionsAny = (requiredPermissions: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const permissions = req.auth.payload.permissions || [];
		for (const requiredPermission of requiredPermissions) {
			if (permissions.includes(requiredPermission)) {
				return next();
			}
		}
		return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
	}
}

export const checkPermissionsAll = (requiredPermissions: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const permissions = req.auth.payload.permissions || [];
		for (const requiredPermission of requiredPermissions) {
			if (!permissions.includes(requiredPermission)) {
				return res.status(403).json({ error: `Forbidden: Insufficient permissions: missing ${requiredPermission}` });
			}
		}
		return next();
	}
}

export const extractUserId = (req: Request, res: Response, next: NextFunction) => {
	try {
		// Extract user ID from Auth0 JWT token
		if (req.auth && req.auth.payload && req.auth.payload.sub) {
			req.body.user_id = req.auth.payload.sub;
		}
		next();
	} catch (error) {
		console.error('Error extracting user ID:', error);
		next();
	}
};

// This is for the post login hook in Auth0
export const checkAuth0ApiSecret = (req: Request, res: Response, next: NextFunction) => {
	const apiSecret = req.headers['Authentication'];
	if (apiSecret !== process.env.AUTH0_API_SECRET) {
		return res.status(403).json({ error: 'Forbidden: Invalid API secret' });
	}
	return next();
}
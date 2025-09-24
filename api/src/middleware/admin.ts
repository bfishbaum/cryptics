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
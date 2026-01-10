import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production-min32chars';

/**
 * Middleware to verify JWT token from request
 * Token should be in Authorization header: "Bearer <token>"
 */
export function verifyToken(req) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { valid: false, error: 'Missing or invalid authorization header' };
        }

        const token = authHeader.substring(7); // Remove "Bearer " prefix
        const decoded = jwt.verify(token, JWT_SECRET);

        return { valid: true, userId: decoded.userId, username: decoded.username };
    } catch (error) {
        return { valid: false, error: 'Invalid or expired token' };
    }
}

/**
 * Verify user owns the resource they're trying to access
 */
export function verifyResourceOwnership(tokenUserId, requestUserId) {
    return tokenUserId === requestUserId;
}

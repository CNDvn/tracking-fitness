import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production-min32chars';

/**
 * Verifies a JWT token string.
 * @param {string} token - The JWT token.
 * @returns {{valid: boolean, error?: string, userId?: string, username?: string}}
 */
export function verifyToken(token) {
    if (!token) {
        return { valid: false, error: 'Token is missing' };
    }
    try {
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

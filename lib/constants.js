// Environment variables for security
// Create a .env.local file in the project root with:
// JWT_SECRET=your_secret_key_here_min_32_chars_long
// NODE_ENV=development or production

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production-min32chars';

export default JWT_SECRET;

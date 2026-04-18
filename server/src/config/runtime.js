const DEFAULT_FRONTEND_ORIGIN = 'http://localhost:5173';
const DEFAULT_MONGO_URI = 'mongodb://localhost:27017/chatx';
const DEFAULT_JWT_EXPIRE = '7d';
const DEVELOPMENT_JWT_SECRET = 'chatx-dev-jwt-secret-change-me';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Get allowed CORS origins
 * In production, the frontend is served from the same origin so we allow all origins
 * In development, only allow the dev frontend URL
 */
function getAllowedOrigins() {
  // In production, frontend is served from same domain
  if (isProduction) {
    return ['*']; // or you can restrict to specific Railway domain
  }

  // Dev: allow vite dev server and localhost variants
  const rawOrigins =
    process.env.FRONTEND_URLS ||
    process.env.FRONTEND_URL ||
    DEFAULT_FRONTEND_ORIGIN;

  return rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function getMongoUri() {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }

  if (isProduction) {
    // Fallback for production - uses local MongoDB
    // WARNING: For production, set MONGODB_URI in Railway environment variables
    console.warn('⚠️  WARNING: MONGODB_URI not set. Using fallback MongoDB. Set MONGODB_URI in Railway dashboard immediately.');
    return DEFAULT_MONGO_URI;
  }

  return DEFAULT_MONGO_URI;
}

function getJwtSecret() {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (isProduction) {
    // Fallback for production - generates a temporary secret
    // WARNING: For security, set JWT_SECRET in your Railway environment variables
    console.warn('⚠️  WARNING: JWT_SECRET not set. Using temporary secret. Set JWT_SECRET in Railway dashboard immediately.');
    return 'production-temporary-secret-change-in-railway-dashboard-' + Date.now();
  }

  return DEVELOPMENT_JWT_SECRET;
}

function getJwtExpire() {
  return process.env.JWT_EXPIRE || DEFAULT_JWT_EXPIRE;
}

module.exports = {
  getAllowedOrigins,
  getJwtExpire,
  getJwtSecret,
  getMongoUri,
  isProduction,
};

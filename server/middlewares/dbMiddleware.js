import dbConnect, { isDbConnected } from '../config/mongoose.config.js';

export const requireDb = async (req, res, next) => {
  try {
    await dbConnect();
    if (!isDbConnected()) {
      return res.status(503).json({
        message: 'Database not connected. Set MONGODB_URI in server/.env (local) or Vercel env vars (live).',
      });
    }
    next();
  } catch {
    return res.status(503).json({
      message: 'Database connection failed. Check MongoDB Atlas Network Access (0.0.0.0/0).',
    });
  }
};

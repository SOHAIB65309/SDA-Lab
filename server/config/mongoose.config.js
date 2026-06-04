import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const cache = global.mongooseCache ?? (global.mongooseCache = { promise: null });

export function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

async function dbConnect() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI missing — set in server/.env (local) or Vercel Environment Variables');
    return false;
  }

  if (isDbConnected()) return true;

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 15000,
        bufferCommands: false,
      })
      .then(() => {
        console.log('✅ Connected to MongoDB successfully');
        return true;
      })
      .catch((error) => {
        cache.promise = null;
        console.error('❌ MongoDB connection error:', error.message);
        throw error;
      });
  }

  try {
    await cache.promise;
    return isDbConnected();
  } catch {
    return false;
  }
}

export default dbConnect;

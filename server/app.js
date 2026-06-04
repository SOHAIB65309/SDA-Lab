import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import dbConnect, { isDbConnected } from './config/mongoose.config.js';
import { requireDb } from './middlewares/dbMiddleware.js';
import Router from './routes/routes.js';

dotenv.config();

const app = express();

app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(process.cwd(), 'upload/images')));

// Local dev: connect in background. Vercel: requireDb connects per request.
if (!process.env.VERCEL) {
  dbConnect();
}

app.use('/api', requireDb, Router);

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ShopEase API is running',
    database: isDbConnected() ? 'connected' : 'disconnected',
  });
});

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

export default app;

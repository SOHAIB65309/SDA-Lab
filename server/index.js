import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import dbConnect from './config/mongoose.config.js';
import Router from './routes/routes.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 9999;

// ── Middleware ──
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static files (uploaded product/banner images) ──
app.use('/images', express.static(path.join(process.cwd(), 'upload/images')));

// ── Connect to MongoDB ──
dbConnect();

// ── API Routes ──
app.use('/api', Router);

// ── Health check ──
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'ShopEase API is running' });
});

// ── 404 handler ──
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler ──
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// ── Start server ──
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

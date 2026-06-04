import app from './app.js';

// Local development ke liye port listener (Bina kisi condition ke)
const PORT = process.env.PORT || 9999;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} already in use. Run: npx kill-port ${PORT}`);
  } else {
    console.error('❌ Server error:', err.message);
  }
  process.exit(1);
});

// Vercel Serverless requirements ke liye app export hona zaroori hai
export default app;
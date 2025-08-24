import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypticRouter from './routes/crypticRoutes';
import { runMigrations } from './migrations/run-migrations';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'https://127.0.0.1:5173'],
}));

app.use(express.json());

// Auth routes
app.use('/api', crypticRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server with conditional migrations
async function startServer() {
  try {
    // Only run migrations in development environment
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production') {
      console.log('🔧 Development environment detected - running migrations...');
      await runMigrations();
      console.log('✅ Migrations completed successfully');
    } else {
      console.log('🚀 Production environment - skipping automatic migrations');
    }

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Cryptics API server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

startServer();
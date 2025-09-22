import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypticRouter from './routes/crypticRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'https://127.0.0.1:5173'],
}));

app.use(express.json());

app.use('/api', crypticRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server with conditional migrations
// async function startServer() {
//     app.listen(PORT, () => {
//       console.log(`🚀 Cryptics API server running on port ${PORT}`);
//       console.log(`📊 Health check: http://localhost:${PORT}/health`);
//       console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
//       console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
//     });
// }

export default app;

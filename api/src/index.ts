import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv';
import crypticRouter from './routes/crypticRoutes.js';

const app = express()

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'https://127.0.0.1:5173', 'https://bfishbaum.github.io/cryptics'],
}));


app.use(express.json());
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


app.use('/api', crypticRouter);
export default app

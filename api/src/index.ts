import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv';
import crypticRouter from './routes/crypticRoutes.js';
import userRouter from './routes/userRoutes.js';
import userPuzzlesRouter from './routes/userPuzzlesRoutes.js';

const app = express()

const cors_setting = {
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'https://bfishbaum.github.io/cryptics'],
  credentials: true,
}

app.use(express.json());
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


app.use('/api/cryptics/', cors(cors_setting), crypticRouter);
app.use('/api/users/', userRouter);
app.use('/api/userspuzzles/', cors(cors_setting), userPuzzlesRouter);
export default app
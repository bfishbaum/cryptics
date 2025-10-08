import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypticRouter from './routes/crypticRoutes.js';
import userRouter from './routes/userRoutes.js';
import userPuzzlesRouter from './routes/userPuzzlesRoutes.js';

dotenv.config();

const app = express();

const parseOrigins = (rawOrigins: string | undefined): string[] => {
  if (!rawOrigins) {
    return [];
  }

  return rawOrigins
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);
};

const allowedOrigins = [
  ...parseOrigins(process.env.FRONTEND_URL),
  'https://bfishbaum.github.io/cryptics'
];

console.log('Allowed origins:', allowedOrigins);

const cors_setting = {
  origin: allowedOrigins.length > 0 ? allowedOrigins : ['http://localhost:5173'],
  credentials: true,
};

app.use(express.json());
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


app.use('/api/cryptics/', cors(cors_setting), crypticRouter);
app.use('/api/users/', cors(cors_setting), userRouter);
app.use('/api/userpuzzles/', cors(cors_setting), userPuzzlesRouter);
export default app
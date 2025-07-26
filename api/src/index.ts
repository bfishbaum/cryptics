import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { DatabaseService, CryptogramInput } from './database';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all cryptograms
app.get('/api/cryptograms', async (req, res) => {
  try {
    const cryptograms = await DatabaseService.getAllCryptograms();
    res.json(cryptograms);
  } catch (error) {
    console.error('Error fetching cryptograms:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
});

// Get latest cryptogram (must come before /:id route)
app.get('/api/cryptograms/latest', async (req, res) => {
  try {
    const cryptogram = await DatabaseService.getLatestCryptogram();
    if (!cryptogram) {
      return res.status(404).json({ error: 'No cryptograms found' });
    }

    res.json(cryptogram);
  } catch (error) {
    console.error('Error fetching latest cryptogram:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
});

// Get paginated cryptograms
app.get('/api/cryptograms/paginated', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const cryptograms = await DatabaseService.getLatestCryptograms(page, limit);
    res.json(cryptograms);
  } catch (error) {
    console.error('Error fetching paginated cryptograms:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
});

// Get cryptogram by ID (must come after specific routes)
app.get('/api/cryptograms/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const cryptogram = await DatabaseService.getCryptogramById(id);
    if (!cryptogram) {
      return res.status(404).json({ error: 'Cryptogram not found' });
    }

    res.json(cryptogram);
  } catch (error) {
    console.error('Error fetching cryptogram:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
});

// Create new cryptogram
app.post('/api/cryptograms', async (req, res) => {
  try {
    const cryptogramData: CryptogramInput = req.body;

    // Basic validation
    if (!cryptogramData.puzzle || !cryptogramData.solution) {
      return res.status(400).json({ error: 'Puzzle and solution are required' });
    }

    const cryptogram = await DatabaseService.createCryptogram(cryptogramData);
    res.status(201).json(cryptogram);
  } catch (error) {
    console.error('Error creating cryptogram:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
});

// Delete cryptogram by ID
app.delete('/api/cryptograms/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const deleted = await DatabaseService.deleteCryptogram(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Cryptogram not found' });
    }

    res.json({ message: 'Cryptogram deleted successfully', id });
  } catch (error) {
    console.error('Error deleting cryptogram:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Cryptics API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
});
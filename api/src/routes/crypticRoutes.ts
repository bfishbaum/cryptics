import { Router } from "express";

import { CrypticDatabaseService } from "../database/cryptic.js";
import { type Cryptogram, type CryptogramInput } from '../types/crypticTypes.js';
import { jwtCheck, checkPermissionsAny } from '../middleware/admin.js';

const router = Router();
// Get all cryptograms
router.get('/cryptograms', async (req, res) => {
  const startTime = Date.now();
  console.log('📝 GET /api/cryptograms - Fetching all cryptograms');
  
  try {
    const cryptograms = await CrypticDatabaseService.getAllCryptograms();
    const duration = Date.now() - startTime;
    
    console.log(`✅ GET /api/cryptograms - Success (${cryptograms.length} cryptograms) - ${duration}ms`);
    res.json(cryptograms);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ GET /api/cryptograms - Error after ${duration}ms:`, error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
});

// Get latest cryptogram (must come before /:id route)
router.get('/cryptograms/latest', async (req, res) => {
  const startTime = Date.now();
  console.log('🎯 GET /api/cryptograms/latest - Fetching latest cryptogram');
  
  try {
    const cryptogram = await CrypticDatabaseService.getLatestCryptogram();
    const duration = Date.now() - startTime;
    
    if (!cryptogram) {
      console.log(`⚠️  GET /api/cryptograms/latest - No cryptograms found - ${duration}ms`);
      return res.status(204); // No Content
    }

    console.log(`✅ GET /api/cryptograms/latest - Success (ID: ${cryptogram.id}) - ${duration}ms`);
    res.json(cryptogram);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ GET /api/cryptograms/latest - Error after ${duration}ms:`, error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
});

// Get paginated cryptograms
router.get('/cryptograms/paginated', async (req, res) => {
  const startTime = Date.now();
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  
  console.log(`📄 GET /api/cryptograms/paginated - Page ${page}, Limit ${limit}`);
  
  try {
    const cryptograms = await CrypticDatabaseService.getLatestCryptograms(page, limit);
    const duration = Date.now() - startTime;
    
    console.log(`✅ GET /api/cryptograms/paginated - Success`); 
    res.json(cryptograms);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ GET /api/cryptograms/paginated - Error after ${duration}ms:`, error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
});

// Get cryptogram by ID (must come after specific routes)
router.get('/cryptograms/:id', async (req, res) => {
  const startTime = Date.now();
  const id = parseInt(req.params.id);
  
  console.log(`🔍 GET /api/cryptograms/${req.params.id} - Fetching cryptogram by ID`);
  
  try {
    if (isNaN(id)) {
      console.log(`⚠️  GET /api/cryptograms/${req.params.id} - Invalid ID format`);
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const cryptogram = await CrypticDatabaseService.getCryptogramById(id);
    const duration = Date.now() - startTime;
    
    if (!cryptogram) {
      console.log(`⚠️  GET /api/cryptograms/${id} - Cryptogram not found - ${duration}ms`);
      return res.status(404).json({ error: 'Cryptogram not found' });
    }

    console.log(`✅ GET /api/cryptograms/${id} - Success - ${duration}ms`);
    res.json(cryptogram);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ GET /api/cryptograms/${id} - Error after ${duration}ms:`, error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
});

// Create new cryptogram (requires authentication)
router.post('/cryptograms', jwtCheck, checkPermissionsAny(['member', 'admin']), async (req, res) => {
  const startTime = Date.now();
  console.log('➕ POST /api/cryptograms - Creating new cryptogram');
  
  try {
    const cryptogramData: CryptogramInput = req.body;
    
    console.log(`📋 POST /api/cryptograms - Data: ${JSON.stringify({
      hasTitle: !!cryptogramData.puzzle,
      hasContent: !!cryptogramData.solution,
      source: cryptogramData.source,
      difficulty: cryptogramData.difficulty
    })}`);

    // Basic validation
    if (!cryptogramData.puzzle || !cryptogramData.solution) {
      console.log('⚠️  POST /api/cryptograms - Validation failed: Missing puzzle or solution');
      return res.status(400).json({ error: 'Puzzle and solution are required' });
    }

    const cryptogram = await CrypticDatabaseService.createCryptogram(cryptogramData);
    const duration = Date.now() - startTime;
    
    console.log(`✅ POST /api/cryptograms - Success (ID: ${cryptogram.id}) - ${duration}ms`);
    res.status(201).json(cryptogram);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ POST /api/cryptograms - Error after ${duration}ms:`, error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
});

// Delete cryptogram by ID (requires admin)
router.delete('/cryptograms/:id', jwtCheck, checkPermissionsAny(['admin']) , async (req, res) => {
  const startTime = Date.now();
  const id = parseInt(req.params.id);
  
  console.log(`🗑️  DELETE /api/cryptograms/${req.params.id} - Deleting cryptogram`);
  
  try {
    if (isNaN(id)) {
      console.log(`⚠️  DELETE /api/cryptograms/${req.params.id} - Invalid ID format`);
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const deleted = await CrypticDatabaseService.deleteCryptogram(id);
    const duration = Date.now() - startTime;
    
    if (!deleted) {
      console.log(`⚠️  DELETE /api/cryptograms/${id} - Cryptogram not found - ${duration}ms`);
      return res.status(404).json({ error: 'Cryptogram not found' });
    }

    console.log(`✅ DELETE /api/cryptograms/${id} - Success - ${duration}ms`);
    res.json({ message: 'Cryptogram deleted successfully', id });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ DELETE /api/cryptograms/${id} - Error after ${duration}ms:`, error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
});

export default router;
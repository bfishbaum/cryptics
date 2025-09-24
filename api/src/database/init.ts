/**
 * Database initialization script
 * Run this to set up the database schema and sample data
 */

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'cryptics',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// async function initializeDatabase() {
//   const client = await pool.connect();

//   try {
//     console.log('🚀 Starting database initialization...');

//     // Read schema file
//     const schemaPath = path.join(__dirname, 'schema.sql');
//     const schema = fs.readFileSync(schemaPath, 'utf8');

//     // Execute schema
//     console.log('📋 Creating database schema...');
//     await client.query(schema);

//     console.log('✅ Database schema created successfully!');

//     // Check if sample data was inserted
//     const userCount = await client.query('SELECT COUNT(*) FROM users');
//     console.log(`👥 Created ${userCount.rows[0].count} sample users`);

//     console.log('🎉 Database initialization completed successfully!');
//     console.log('');
//     console.log('Sample users created:');
//     console.log('- Admin: admin@crypticclues.com / admin123');
//     console.log('- User: user@example.com / user123');

//   } catch (error) {
//     console.error('❌ Error initializing database:', error);
//     throw error;
//   } finally {
//     client.release();
//     await pool.end();
//   }
// }

export function getPool(): Pool {
  return pool;
}

// export { initializeDatabase };
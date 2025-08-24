-- Database initialization script for Cryptics
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- The main tables will be created via migrations
-- This file ensures the database is ready for our application

-- Create a simple version tracking table
CREATE TABLE IF NOT EXISTS schema_version (
  version VARCHAR(50) PRIMARY KEY,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial version
INSERT INTO schema_version (version) VALUES ('1.0.0') ON CONFLICT DO NOTHING;

-- Log initialization
DO $$
BEGIN
  RAISE NOTICE 'Cryptics database initialized successfully';
END $$;
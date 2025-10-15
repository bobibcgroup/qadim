-- Initialize the database with pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the qadim database if it doesn't exist
-- This is handled by the POSTGRES_DB environment variable

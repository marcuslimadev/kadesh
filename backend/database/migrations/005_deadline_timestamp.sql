-- Migration: Change deadline from DATE to TIMESTAMP WITH TIME ZONE
-- This allows storing both date and time for auction deadlines

-- Alter the deadline column to support time
ALTER TABLE projects
ALTER COLUMN deadline TYPE TIMESTAMP WITH TIME ZONE
USING deadline::TIMESTAMP WITH TIME ZONE;

-- Add comment
COMMENT ON COLUMN projects.deadline IS 'Auction deadline with date and time for countdown functionality';

-- Migration: Add estimated_hours to projects
-- Date: 2025-12-04
-- Description: Adiciona campo de horas estimadas para projetos

-- Add estimated_hours column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS estimated_hours INTEGER DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN projects.estimated_hours IS 'Número estimado de horas para conclusão do projeto';

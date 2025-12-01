-- Ajusta coluna de prazo para armazenar data + hora reais
ALTER TABLE projects
  ALTER COLUMN deadline TYPE TIMESTAMPTZ
  USING (deadline::timestamptz);

COMMENT ON COLUMN projects.deadline IS 'Prazo final do leilao com data e hora (TIMESTAMPTZ)';

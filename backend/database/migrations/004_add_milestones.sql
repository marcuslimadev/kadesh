-- Milestones/Escrow System Migration
-- Add milestones table for contract partial payments

CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  due_date DATE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'submitted', 'approved', 'rejected', 'released')),
  submitted_at TIMESTAMP,
  approved_at TIMESTAMP,
  released_at TIMESTAMP,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_milestones_contract ON milestones(contract_id);
CREATE INDEX idx_milestones_status ON milestones(status);

-- Add escrow fields to contracts
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS escrow_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS escrow_total DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS escrow_released DECIMAL(10, 2) DEFAULT 0;

-- Trigger to update contract escrow_released when milestone is released
CREATE OR REPLACE FUNCTION update_contract_escrow()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'released' AND OLD.status != 'released' THEN
    UPDATE contracts
    SET escrow_released = escrow_released + NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.contract_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER milestone_released_trigger
AFTER UPDATE ON milestones
FOR EACH ROW
WHEN (NEW.status = 'released')
EXECUTE FUNCTION update_contract_escrow();

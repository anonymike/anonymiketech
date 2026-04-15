-- Migration: Add installation instructions, system requirements, and version history to premium_apps table
-- Date: 2026-04-15
-- Description: Extends premium_apps table with new JSONB fields for enhanced app information

-- Add new JSONB columns for installation instructions
ALTER TABLE premium_apps 
ADD COLUMN installation_instructions JSONB DEFAULT NULL;

-- Add new JSONB column for system requirements
ALTER TABLE premium_apps 
ADD COLUMN system_requirements JSONB DEFAULT NULL;

-- Add new JSONB column for version history
ALTER TABLE premium_apps 
ADD COLUMN version_history JSONB DEFAULT NULL;

-- Update the updated_at timestamp for the table modification
UPDATE premium_apps SET updated_at = NOW() WHERE updated_at IS NULL;

-- Create or replace the function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_premium_apps_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS premium_apps_update_timestamp ON premium_apps;

-- Create trigger to automatically update updated_at on every update
CREATE TRIGGER premium_apps_update_timestamp
BEFORE UPDATE ON premium_apps
FOR EACH ROW
EXECUTE FUNCTION update_premium_apps_updated_at();

-- Add comments to document the new columns
COMMENT ON COLUMN premium_apps.installation_instructions IS 'JSONB: {steps: [{title: string, description: string}]}';
COMMENT ON COLUMN premium_apps.system_requirements IS 'JSONB: {minAndroidVersion: string, minRAM: string, minStorage: string, processor?: string}';
COMMENT ON COLUMN premium_apps.version_history IS 'JSONB: [{version: string, releaseDate: string, changes: [string]}]';

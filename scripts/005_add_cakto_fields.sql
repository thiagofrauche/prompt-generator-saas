-- Add Cakto-related fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS cakto_order_id TEXT,
ADD COLUMN IF NOT EXISTS cakto_ref_id TEXT;

-- Add index for faster lookup by order ID
CREATE INDEX IF NOT EXISTS idx_profiles_cakto_order_id ON profiles(cakto_order_id);

-- Add comment for documentation
COMMENT ON COLUMN profiles.cakto_order_id IS 'Cakto order ID from purchase_approved webhook';
COMMENT ON COLUMN profiles.cakto_ref_id IS 'Cakto reference ID for the order';

-- Phase 4: Add idempotency columns to events table

ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS processed_at timestamptz,
ADD COLUMN IF NOT EXISTS processing_error text;

-- Index for finding unprocessed events efficiently
CREATE INDEX IF NOT EXISTS idx_events_unprocessed 
  ON public.events (user_id, processed_at) 
  WHERE processed_at IS NULL;

-- Index for monitoring processing errors
CREATE INDEX IF NOT EXISTS idx_events_errors 
  ON public.events (user_id, processed_at) 
  WHERE processing_error IS NOT NULL;

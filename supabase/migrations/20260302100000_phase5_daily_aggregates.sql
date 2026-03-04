-- Phase 5: Expand daily_activity for per-type aggregates

-- Drop the generic activity_count column and add specific columns
ALTER TABLE public.daily_activity
DROP COLUMN IF EXISTS activity_count,
ADD COLUMN IF NOT EXISTS coding_minutes int NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS study_minutes int NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS workouts_count int NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS sleep_hours numeric NOT NULL DEFAULT 0;

-- Add updated_at for tracking when aggregates were last modified
ALTER TABLE public.daily_activity
ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

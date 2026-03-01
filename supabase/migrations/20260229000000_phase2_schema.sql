-- Phase 2: Event log + read models. All tables RLS-enabled, user-scoped.

-- =============================================================================
-- EVENTS (immutable source of truth)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  ts timestamptz NOT NULL DEFAULT now(),
  value jsonb,
  metadata jsonb
);

CREATE INDEX IF NOT EXISTS idx_events_user_ts ON public.events (user_id, ts DESC);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own events" ON public.events;
CREATE POLICY "Users can read own events"
  ON public.events FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own events" ON public.events;
CREATE POLICY "Users can insert own events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- No UPDATE/DELETE policies: events are immutable.

-- =============================================================================
-- DAILY_ACTIVITY (read model)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.daily_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  activity_count int NOT NULL DEFAULT 0,
  UNIQUE (user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date ON public.daily_activity (user_id, date);

ALTER TABLE public.daily_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own daily_activity" ON public.daily_activity;
CREATE POLICY "Users can read own daily_activity"
  ON public.daily_activity FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own daily_activity" ON public.daily_activity;
CREATE POLICY "Users can insert own daily_activity"
  ON public.daily_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own daily_activity" ON public.daily_activity;
CREATE POLICY "Users can update own daily_activity"
  ON public.daily_activity FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own daily_activity" ON public.daily_activity;
CREATE POLICY "Users can delete own daily_activity"
  ON public.daily_activity FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================================================
-- STREAKS (read model)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  metric text NOT NULL,
  current_streak int NOT NULL DEFAULT 0,
  longest_streak int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, metric)
);

CREATE INDEX IF NOT EXISTS idx_streaks_user_metric ON public.streaks (user_id, metric);

ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own streaks" ON public.streaks;
CREATE POLICY "Users can read own streaks"
  ON public.streaks FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own streaks" ON public.streaks;
CREATE POLICY "Users can insert own streaks"
  ON public.streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own streaks" ON public.streaks;
CREATE POLICY "Users can update own streaks"
  ON public.streaks FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own streaks" ON public.streaks;
CREATE POLICY "Users can delete own streaks"
  ON public.streaks FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================================================
-- SCORES (read model)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  score numeric NOT NULL DEFAULT 0,
  UNIQUE (user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_scores_user_date ON public.scores (user_id, date);

ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own scores" ON public.scores;
CREATE POLICY "Users can read own scores"
  ON public.scores FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own scores" ON public.scores;
CREATE POLICY "Users can insert own scores"
  ON public.scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own scores" ON public.scores;
CREATE POLICY "Users can update own scores"
  ON public.scores FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own scores" ON public.scores;
CREATE POLICY "Users can delete own scores"
  ON public.scores FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================================================
-- NUDGES (read model)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.nudges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  type text,
  message text,
  read boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_nudges_user_created ON public.nudges (user_id, created_at DESC);

ALTER TABLE public.nudges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own nudges" ON public.nudges;
CREATE POLICY "Users can read own nudges"
  ON public.nudges FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own nudges" ON public.nudges;
CREATE POLICY "Users can insert own nudges"
  ON public.nudges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own nudges" ON public.nudges;
CREATE POLICY "Users can update own nudges"
  ON public.nudges FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own nudges" ON public.nudges;
CREATE POLICY "Users can delete own nudges"
  ON public.nudges FOR DELETE
  USING (auth.uid() = user_id);

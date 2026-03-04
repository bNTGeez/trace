/**
 * Shared event type for background processing and read-model updates.
 * Matches the shape of event rows selected from the events table.
 * Use this type everywhere event data is passed (processEvent, updateDailyActivity, updateStreaks).
 */

export interface Event {
  id: string;
  user_id: string;
  type: string;
  ts: string;
  value: unknown;
  metadata: unknown;
  processed_at?: string | null;
}

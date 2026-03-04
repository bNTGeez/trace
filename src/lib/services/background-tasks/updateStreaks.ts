import type { Event } from "@/lib/events/types";

/**
 * Update streaks read model based on event.
 *
 * Phase 4: Stub implementation
 * Phase 6: Real streak logic
 */

export async function updateStreaks(event: Event): Promise<void> {
  console.log("[updateStreaks] stub called", {
    eventId: event.id,
    userId: event.user_id,
    type: event.type,
    ts: event.ts,
  });

  // Phase 6: Implement real logic
  // - Determine if streak continues or breaks
  // - Update current_streak and longest_streak
  // - Handle multiple metrics
}

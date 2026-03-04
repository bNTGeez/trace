import type { Event } from "@/lib/events/types";
import { getServiceClient } from "@/lib/supabase/service";
import { updateDailyActivity } from "./updateDailyActivity";
import { updateStreaks } from "./updateStreaks";
import { computeMomentumScore } from "./computeMomentumScore";

/**
 * Background event processor — idempotent, tenant-scoped, worker-ready.
 *
 * Architecture:
 * - No session/cookie access (simulates worker environment)
 * - Explicit context via parameters (eventId, userId)
 * - Idempotency via processed_at column
 * - Service-role client for RLS bypass
 *
 * Safety guarantees:
 * - Ownership verification (event must belong to userId)
 * - At-most-once processing (claim via processed_at)
 * - Structured logging for observability
 * - Error capture without throwing
 *
 * @param eventId - UUID of event to process
 * @param userId - UUID of user who owns the event (prevents cross-tenant bugs)
 */
export async function processEvent({
  eventId,
  userId,
}: {
  eventId: string;
  userId: string;
}): Promise<void> {
  const label = "processEvent";
  console.time(label);

  const context = { eventId, userId };
  console.log(`[${label}] started`, context);

  try {
    const supabase = getServiceClient();

    // Step 1: Fetch and verify ownership
    const { data: event, error: fetchError } = await supabase
      .from("events")
      .select("id, user_id, type, ts, value, metadata, processed_at")
      .eq("id", eventId)
      .eq("user_id", userId)
      .single();

    if (fetchError || !event) {
      console.error(`[${label}] event not found or ownership mismatch`, {
        ...context,
        error: fetchError?.message,
      });
      return;
    }

    const eventRow: Event = event as Event;

    // Step 2: Claim the event (idempotency guard)
    const { data: claimedRows, error: claimError } = await supabase
      .from("events")
      // @ts-expect-error — events table has processed_at; Supabase generated types may not include it yet
      .update({ processed_at: new Date().toISOString() })
      .eq("id", eventId)
      .eq("user_id", userId)
      .is("processed_at", null)
      .select("id");

    if (claimError) {
      console.error(`[${label}] claim error`, {
        ...context,
        claimError: claimError.message,
      });
      return;
    }
    if (!claimedRows || claimedRows.length === 0) {
      console.log(`[${label}] already processed`, context);
      return;
    }

    console.log(`[${label}] claimed event`, {
      ...context,
      type: eventRow.type,
      ts: eventRow.ts,
    });

    // Step 3: Execute processing steps (date = bucket for scores read model)
    const eventDate = eventRow.ts.slice(0, 10); // YYYY-MM-DD
    await updateDailyActivity(eventRow);
    await updateStreaks(eventRow);
    await computeMomentumScore(userId, eventDate);

    console.log(`[${label}] completed`, context);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[${label}] processing failed`, {
      ...context,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Record error in database for monitoring
    try {
      const supabase = getServiceClient();
      await supabase
        .from("events")
        // @ts-expect-error — events table has processing_error; Supabase generated types may not include it yet
        .update({ processing_error: errorMessage })
        .eq("id", eventId)
        .eq("user_id", userId);
    } catch (updateError) {
      console.error(`[${label}] failed to record error`, {
        ...context,
        updateError,
      });
    }

    // Don't rethrow — let caller handle via .catch()
  } finally {
    console.timeEnd(label);
  }
}

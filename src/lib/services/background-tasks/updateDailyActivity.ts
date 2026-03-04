import type { Event } from "@/lib/events/types";
import { getServiceClient } from "@/lib/supabase/service";

/**
 * Update daily_activity read model based on event.
 * 
 * Aggregates events by date and type:
 * - coding → coding_minutes
 * - study → study_minutes
 * - workout → workouts_count
 * - sleep → sleep_hours
 * 
 * Uses upsert to avoid duplicates and increment existing values.
 */

export async function updateDailyActivity(event: Event): Promise<void> {
  const label = "updateDailyActivity";
  console.time(label);

  // Extract date (YYYY-MM-DD) from event timestamp
  const eventDate = event.ts.slice(0, 10);
  const value = typeof event.value === "number" ? event.value : 0;

  console.log(`[${label}] processing`, {
    eventId: event.id,
    userId: event.user_id,
    type: event.type,
    date: eventDate,
    value,
  });

  const supabase = getServiceClient();

  // Fetch existing row for this user + date
  const { data: existing } = await supabase
    .from("daily_activity")
    .select("id, coding_minutes, study_minutes, workouts_count, sleep_hours")
    .eq("user_id", event.user_id)
    .eq("date", eventDate)
    .single();

  // Calculate new values based on event type
  const existingRow = existing as {
    coding_minutes: number;
    study_minutes: number;
    workouts_count: number;
    sleep_hours: number;
  } | null;

  const updates = existingRow
    ? {
        coding_minutes: existingRow.coding_minutes,
        study_minutes: existingRow.study_minutes,
        workouts_count: existingRow.workouts_count,
        sleep_hours: existingRow.sleep_hours,
      }
    : {
        coding_minutes: 0,
        study_minutes: 0,
        workouts_count: 0,
        sleep_hours: 0,
      };

  switch (event.type) {
    case "coding":
      updates.coding_minutes += value;
      break;
    case "study":
      updates.study_minutes += value;
      break;
    case "workout":
      updates.workouts_count += 1;
      break;
    case "sleep":
      updates.sleep_hours = value / 60; // assume value is in minutes, store as hours
      break;
  }

  // Upsert: insert if new, update if exists
  const { error } = await supabase
    .from("daily_activity")
    // @ts-expect-error — daily_activity columns may not be in generated types yet
    .upsert(
      {
        user_id: event.user_id,
        date: eventDate,
        ...updates,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,date",
      }
    );

  if (error) {
    console.error(`[${label}] upsert failed`, {
      eventId: event.id,
      userId: event.user_id,
      date: eventDate,
      error: error.message,
    });
    throw error;
  }

  console.log(`[${label}] completed`, {
    eventId: event.id,
    userId: event.user_id,
    date: eventDate,
    updates,
  });
  console.timeEnd(label);
}

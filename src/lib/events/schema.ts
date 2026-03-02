import { z } from "zod";

export const EVENT_TYPES = ["coding", "workout", "sleep", "study"] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const eventInputSchema = z.object({
  type: z.enum(EVENT_TYPES),
  value: z.number(),
  ts: z.string().datetime().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type EventInput = z.infer<typeof eventInputSchema>;

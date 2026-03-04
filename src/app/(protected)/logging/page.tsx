"use client";

import { useState } from "react";
import { EVENT_TYPES } from "@/lib/events/schema";

export default function LoggingPage() {
  const [type, setType] = useState<string>("coding");
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          value: parseFloat(value),
          ts: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({
          type: "error",
          text: data.error || "Failed to log event",
        });
        return;
      }

      setMessage({ type: "success", text: `Event logged: ${data.id}` });
      setValue("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Network error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
        Log Event
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 space-y-6 max-w-md"
      >
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Event Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="value"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Value
            <span className="text-zinc-500 text-xs ml-2">
              {type === "coding" || type === "study"
                ? "(minutes)"
                : type === "sleep"
                  ? "(minutes)"
                  : "(count)"}
            </span>
          </label>
          <input
            id="value"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            min="0"
            step={type === "workout" ? "1" : "0.1"}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter value"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? "Logging..." : "Log Event"}
        </button>

        {message && (
          <div
            className={`p-4 rounded-md ${
              message.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
            }`}
          >
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}

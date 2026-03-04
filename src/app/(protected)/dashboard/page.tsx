"use client";

import { useEffect, useState } from "react";

interface DailyActivity {
  date: string;
  coding_minutes: number;
  study_minutes: number;
  workouts_count: number;
  sleep_hours: number;
  updated_at: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<DailyActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/daily-activity");
        if (!response.ok) {
          const err = await response.json();
          setError(err.error || "Failed to load data");
          return;
        }
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Network error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
        Dashboard
      </h1>

      {loading && (
        <p className="text-zinc-600 dark:text-zinc-400">
          Loading daily activity...
        </p>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md p-4">
          {error}
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <p className="text-zinc-600 dark:text-zinc-400">
          No activity yet. Start logging events to see your dashboard.
        </p>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Coding
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Study
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Workouts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Sleep
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {data.map((row) => (
                <tr
                  key={row.date}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {new Date(row.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                    {row.coding_minutes > 0 ? `${row.coding_minutes}m` : "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                    {row.study_minutes > 0 ? `${row.study_minutes}m` : "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                    {row.workouts_count > 0 ? row.workouts_count : "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                    {row.sleep_hours > 0
                      ? `${row.sleep_hours.toFixed(1)}h`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

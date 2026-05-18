/** Monday 00:00 local time for the calendar week containing `ts`. */
export function startOfWeekMonday(ts = Date.now()) {
  const d = new Date(ts);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export const DEFAULT_WEEKLY_GOAL = 3;

export function countTransactionsThisWeek(transactions) {
  const weekStart = startOfWeekMonday(Date.now());
  return transactions.filter((t) => (t.createdAt || 0) >= weekStart).length;
}

/**
 * Consecutive *past* full weeks (before the current week) where
 * transaction count >= goal. Current week is shown separately.
 */
export function completedWeekStreak(transactions, goal = DEFAULT_WEEKLY_GOAL) {
  const byWeek = new Map();
  for (const t of transactions) {
    const c = t.createdAt;
    if (!c) continue;
    const wk = startOfWeekMonday(c);
    byWeek.set(wk, (byWeek.get(wk) || 0) + 1);
  }

  const thisWeekStart = startOfWeekMonday(Date.now());
  let streak = 0;
  let wk = thisWeekStart - 7 * 86400000;
  const maxWeeks = 260;

  for (let i = 0; i < maxWeeks; i += 1) {
    const n = byWeek.get(wk) || 0;
    if (n >= goal) {
      streak += 1;
      wk -= 7 * 86400000;
    } else {
      break;
    }
  }

  return streak;
}

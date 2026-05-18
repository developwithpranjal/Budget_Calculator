import { MdLocalFireDepartment } from "react-icons/md";
import {
  completedWeekStreak,
  countTransactionsThisWeek,
  DEFAULT_WEEKLY_GOAL,
} from "../utils/weekStreak";
import "./WeeklyStreak.css";

export default function WeeklyStreak({ transactions, goal = DEFAULT_WEEKLY_GOAL }) {
  const thisWeek = countTransactionsThisWeek(transactions);
  const streak = completedWeekStreak(transactions, goal);
  const metThisWeek = thisWeek >= goal;
  const progress = Math.min(100, Math.round((thisWeek / goal) * 100));

  return (
    <section className="tool-card weekly-streak" aria-labelledby="streak-title">
      <div className="tool-card-head streak-head">
        <div className="streak-icon-wrap" aria-hidden>
          <MdLocalFireDepartment size={22} />
        </div>
        <div>
          <h2 id="streak-title" className="tool-card-title">
            Weekly rhythm
          </h2>
          <p className="tool-card-desc">
            Weeks start Monday. Goal: {goal} entries per week to build the habit.
          </p>
        </div>
      </div>

      <div className="streak-body">
        <div className="streak-big">
          <span className="streak-big-value">{streak}</span>
          <span className="streak-big-label">week streak</span>
        </div>

        <div className="streak-this-week">
          <div className="streak-this-head">
            <span>This week</span>
            <span className="streak-count">
              {thisWeek}/{goal}
            </span>
          </div>
          <div className="streak-bar" role="progressbar" aria-valuenow={thisWeek} aria-valuemin={0} aria-valuemax={goal}>
            <div className="streak-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="streak-foot">
            {metThisWeek
              ? "Goal met for this week."
              : `${goal - thisWeek} more ${goal - thisWeek === 1 ? "entry" : "entries"} to hit the weekly goal.`}
          </p>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect, useRef } from "react";
import "./MonthlyTrends.css";

const STORAGE_KEY = "budget_monthly_history";
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(key) {
  const [year, month] = key.split("-");
  return `${MONTH_NAMES[parseInt(month) - 1]} ${year}`;
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveHistory(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function MonthlyTrends({ currentIncome = 0, currentExpenses = 0 }) {
  const [history, setHistory]         = useState(loadHistory);
  const [saved, setSaved]             = useState(false);
  const [activeTab, setActiveTab]     = useState("chart"); // "chart" | "table"
  const canvasRef                     = useRef(null);
  const chartRef                      = useRef(null);

  // Merge current month's live data into view (not saved yet)
  const currentKey = getMonthKey();
  const displayHistory = {
    ...history,
    [currentKey]: {
      income:   currentIncome,
      expenses: currentExpenses,
      savings:  currentIncome - currentExpenses,
    },
  };

  // Sorted months
  const sortedKeys = Object.keys(displayHistory).sort();
  const labels     = sortedKeys.map(getMonthLabel);
  const incomes    = sortedKeys.map((k) => displayHistory[k].income);
  const expArr     = sortedKeys.map((k) => displayHistory[k].expenses);
  const savArr     = sortedKeys.map((k) => displayHistory[k].savings);

  // ── Build / update Chart ──────────────────────────────
  useEffect(() => {
    if (activeTab !== "chart") return;

    // Dynamically load Chart.js if not already loaded
    const initChart = () => {
      const ctx = canvasRef.current;
      if (!ctx || !window.Chart) return;

      if (chartRef.current) {
        chartRef.current.destroy();
      }

      chartRef.current = new window.Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Income",
              data: incomes,
              borderColor: "#4caf7d",
              backgroundColor: "rgba(76,175,125,0.08)",
              borderWidth: 2.5,
              pointBackgroundColor: "#4caf7d",
              pointRadius: 5,
              pointHoverRadius: 7,
              tension: 0.4,
              fill: true,
            },
            {
              label: "Expenses",
              data: expArr,
              borderColor: "#e07070",
              backgroundColor: "rgba(224,112,112,0.08)",
              borderWidth: 2.5,
              pointBackgroundColor: "#e07070",
              pointRadius: 5,
              pointHoverRadius: 7,
              tension: 0.4,
              fill: true,
            },
            {
              label: "Savings",
              data: savArr,
              borderColor: "#c9a84c",
              backgroundColor: "rgba(201,168,76,0.06)",
              borderWidth: 2,
              pointBackgroundColor: "#c9a84c",
              pointRadius: 4,
              pointHoverRadius: 6,
              tension: 0.4,
              fill: false,
              borderDash: [5, 3],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 700, easing: "easeInOutQuart" },
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                color: "#7a8068",
                font: { family: "'DM Sans', sans-serif", size: 12 },
                usePointStyle: true,
                pointStyleWidth: 10,
                padding: 20,
              },
            },
            tooltip: {
              backgroundColor: "#1a1f16",
              borderColor: "#2a3025",
              borderWidth: 1,
              titleColor: "#e8ead4",
              bodyColor: "#a0a890",
              padding: 12,
              callbacks: {
                label: (ctx) => `  ${ctx.dataset.label}: ₹${ctx.parsed.y.toFixed(2)}`,
              },
            },
          },
          scales: {
            x: {
              grid: { color: "#1e2318", drawBorder: false },
              ticks: { color: "#5a6250", font: { family: "'DM Sans', sans-serif", size: 11 } },
            },
            y: {
              grid: { color: "#1e2318", drawBorder: false },
              ticks: {
                color: "#5a6250",
                font: { family: "'DM Sans', sans-serif", size: 11 },
                callback: (v) => `₹${v}`,
              },
            },
          },
        },
      });
    };

    if (!window.Chart) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js";
      script.onload = initChart;
      document.head.appendChild(script);
    } else {
      initChart();
    }

    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [activeTab, history, currentIncome, currentExpenses]);

  // ── Save current month ────────────────────────────────
  const saveCurrentMonth = () => {
    const updated = {
      ...history,
      [currentKey]: {
        income:   currentIncome,
        expenses: currentExpenses,
        savings:  currentIncome - currentExpenses,
      },
    };
    setHistory(updated);
    saveHistory(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const deleteMonth = (key) => {
    const updated = { ...history };
    delete updated[key];
    setHistory(updated);
    saveHistory(updated);
  };

  // ── Stats ─────────────────────────────────────────────
  const allMonths   = Object.values(displayHistory);
  const avgIncome   = allMonths.length ? allMonths.reduce((s,m) => s + m.income, 0) / allMonths.length : 0;
  const avgExpenses = allMonths.length ? allMonths.reduce((s,m) => s + m.expenses, 0) / allMonths.length : 0;
  const avgSavings  = allMonths.length ? allMonths.reduce((s,m) => s + m.savings, 0) / allMonths.length : 0;
  const bestMonth   = allMonths.length
    ? sortedKeys[allMonths.indexOf(allMonths.reduce((a,b) => a.savings > b.savings ? a : b))]
    : null;

  return (
    <div className="trends-card">
      {/* Header */}
      <div className="trends-header">
        <div className="trends-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h2 className="trends-title">Monthly Trends</h2>
          <p className="trends-sub">Track income, expenses & savings over time</p>
        </div>
        <button
          className={`save-btn ${saved ? "saved" : ""}`}
          onClick={saveCurrentMonth}
          title="Save this month's snapshot"
        >
          {saved ? "✓ Saved!" : "💾 Save Month"}
        </button>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid">
        <div className="stat-box">
          <span className="stat-label">Avg Income</span>
          <span className="stat-value green">₹{avgIncome.toFixed(0)}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Avg Expenses</span>
          <span className="stat-value red">₹{avgExpenses.toFixed(0)}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Avg Savings</span>
          <span className="stat-value gold">₹{avgSavings.toFixed(0)}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Best Month</span>
          <span className="stat-value muted">
            {bestMonth ? getMonthLabel(bestMonth) : "—"}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-row">
        <button
          className={`tab-btn ${activeTab === "chart" ? "active" : ""}`}
          onClick={() => setActiveTab("chart")}
        >
          📈 Chart View
        </button>
        <button
          className={`tab-btn ${activeTab === "table" ? "active" : ""}`}
          onClick={() => setActiveTab("table")}
        >
          📋 Table View
        </button>
      </div>

      {/* Chart */}
      {activeTab === "chart" && (
        <div className="chart-wrap">
          {sortedKeys.length < 2 && (
            <div className="chart-hint">
              Save at least 2 months to see trend lines
            </div>
          )}
          <canvas ref={canvasRef} />
        </div>
      )}

      {/* Table */}
      {activeTab === "table" && (
        <div className="table-wrap">
          {sortedKeys.length === 0 ? (
            <p className="no-data">No monthly data yet. Add transactions and save!</p>
          ) : (
            <table className="trends-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Income</th>
                  <th>Expenses</th>
                  <th>Savings</th>
                  <th>Rate</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {[...sortedKeys].reverse().map((key) => {
                  const m = displayHistory[key];
                  const rate = m.income > 0 ? ((m.savings / m.income) * 100).toFixed(1) : 0;
                  const isCurrent = key === currentKey;
                  return (
                    <tr key={key} className={isCurrent ? "current-row" : ""}>
                      <td>
                        {getMonthLabel(key)}
                        {isCurrent && <span className="live-badge">LIVE</span>}
                      </td>
                      <td className="green">₹{m.income.toFixed(2)}</td>
                      <td className="red">₹{m.expenses.toFixed(2)}</td>
                      <td className={m.savings >= 0 ? "gold" : "red"}>
                        ₹{m.savings.toFixed(2)}
                      </td>
                      <td>
                        <span className={`rate-badge ${rate >= 20 ? "good" : rate >= 0 ? "ok" : "bad"}`}>
                          {rate}%
                        </span>
                      </td>
                      <td>
                        {!isCurrent && (
                          <button
                            className="del-btn"
                            onClick={() => deleteMonth(key)}
                            title="Delete this month"
                          >
                            ×
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
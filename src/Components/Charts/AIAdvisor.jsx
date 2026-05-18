import { useState } from "react";
import "./AIAdvisor.css";

const apiChatUrl = () => {
  const base = import.meta.env.VITE_API_URL;
  if (base && typeof base === "string") {
    const trimmed = base.replace(/\/$/, "");
    return `${trimmed}/api/chat`;
  }
  return "/api/chat";
};

function extractAdviceText(data) {
  if (!data?.content) return "";
  const blocks = Array.isArray(data.content) ? data.content : [];
  return blocks
    .filter((b) => b?.type === "text" && typeof b.text === "string")
    .map((b) => b.text)
    .join("");
}

function buildLocalFallbackAdvice({
  income,
  totalExpenses,
  savings,
  savingsRateNum,
  categoryMap,
}) {
  const topCats = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  let out = "";
  out += "1. 🔍 Quick Summary\n";
  if (income <= 0 && totalExpenses <= 0) {
    out +=
      "Add your income and expenses so we can give sharper guidance next time.\n\n";
  } else if (savings >= 0) {
    out += `After expenses, about ₹${savings.toFixed(0)} remains (${savingsRateNum}% of income saved).\n\n`;
  } else {
    out += `Expenses exceed income by about ₹${Math.abs(savings).toFixed(0)} — treat this as urgent and reduce discretionary spend first.\n\n`;
  }

  out += "2. ⚠️ Problem areas\n";
  if (topCats.length === 0) {
    out += "- Categorise expenses so big leaks show up clearly.\n\n";
  } else {
    topCats.forEach(([c, a]) => {
      out += `- ${c}: ~₹${a.toFixed(0)} — check if this matches your plan.\n`;
    });
    out += "\n";
  }

  out += "3. 💡 Actionable tips\n";
  out += "- Pick one category to trim by ~10% this month.\n";
  out += "- Review subscriptions and autopay once — small fees compound.\n";
  out += "- If income is irregular, build a 1-month mini buffer before extras.\n\n";

  out += "4. 🎯 Savings goal\n";
  if (savings >= 0) {
    const target = Math.max(0, savings * 0.1);
    out += `Try to keep at least ₹${target.toFixed(0)} in surplus next month while staying realistic.`;
  } else {
    const cut = Math.min(
      totalExpenses * 0.05,
      Math.abs(savings) || totalExpenses * 0.05,
    );
    out += `Aim to cut ~₹${cut.toFixed(0)} from monthly spend until cashflow turns positive.`;
  }

  return out.trim();
}

export default function AIAdvisor({ income = 0, expenses = [] }) {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [asked, setAsked] = useState(false);

  const totalExpenses = expenses
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const savings = income - totalExpenses;
  const savingsRateNum =
    income > 0 ? Number(((savings / income) * 100).toFixed(1)) : 0;
  const savingsRate = String(savingsRateNum);

  const categoryMap = {};
  expenses
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const cat = t.category || "Other";
      categoryMap[cat] = (categoryMap[cat] || 0) + Number(t.amount || 0);
    });

  const categoryBreakdown = Object.entries(categoryMap)
    .map(([cat, amt]) => `${cat}: ₹${amt.toFixed(2)}`)
    .join(", ");

  const buildPrompt = () =>
    `
You are a friendly personal finance advisor. Analyze this user's budget and give practical advice.

Monthly Income: ₹${income.toFixed(2)}
Total Expenses: ₹${totalExpenses.toFixed(2)}
Net Savings: ₹${savings.toFixed(2)} (${savingsRate}% savings rate)
Category Breakdown: ${categoryBreakdown || "No category data"}

Transactions:
${
  expenses
    .filter((t) => t.type === "expense")
    .map(
      (t) =>
        `- ${t.description || "Unknown"} (${t.category || "Other"}): ₹${Number(t.amount || 0).toFixed(2)}`,
    )
    .join("\n") || "No transactions yet."
}

Reply with:
1. 🔍 Quick Summary (2 lines)
2. ⚠️ Top 2-3 Problem Areas with ₹ figures
3. 💡 3 Actionable Tips for this month
4. 🎯 One savings goal

Be conversational, use emojis, keep it encouraging and clear.
`.trim();

  const applyOfflineFallback = () => {
    setAdvice(
      buildLocalFallbackAdvice({
        income,
        totalExpenses,
        savings,
        savingsRateNum,
        categoryMap,
      }),
    );
    setError("");
  };

  const getAdvice = async () => {
    if (
      income === 0 &&
      expenses.filter((t) => t.type === "expense").length === 0
    ) {
      setError(
        "Add some income or expense transactions first before asking for advice.",
      );
      return;
    }
    setLoading(true);
    setError("");
    setAdvice("");
    setAsked(true);

    try {
      const response = await fetch(apiChatUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: buildPrompt(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status >= 500) {
          applyOfflineFallback();
          return;
        }
        const msg =
          data?.error?.message ||
          (typeof data?.error === "string" ? data.error : null) ||
          `Request failed (${response.status})`;
        throw new Error(typeof msg === "string" ? msg : "API error");
      }

      const text = extractAdviceText(data);
      if (!text) {
        throw new Error("Empty response from advisor.");
      }
      setAdvice(text);
    } catch (err) {
      const msg = err?.message || "";
      const useLocal = /failed to fetch|networkerror|load failed|502|503|504|bad gateway/i.test(
        msg,
      );
      if (useLocal) {
        applyOfflineFallback();
        return;
      }
      setError("Could not load advice. Please try again in a moment.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatAdvice = (text) =>
    text.split("\n").map((line, i) => (
      <p key={i} className={line.trim() === "" ? "ai-spacer" : "ai-line"}>
        {line}
      </p>
    ));

  return (
    <div className="advisor-shell">
      <div className="advisor-card">
        <header className="advisor-header">
          <div className="advisor-header-main">
            <div className="advisor-icon" aria-hidden>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
                <path
                  d="M17 9l2 2 4-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="advisor-heading-block">
              <h2 id="advisor-main-heading" className="advisor-title">
                AI Advisor
              </h2>
              <p className="advisor-sub">Personalised guidance from Expenso</p>
            </div>
          </div>
        </header>

        <div className="advisor-metrics" role="group" aria-label="Budget snapshot">
          <div className="snapshot-pill income">
            <span className="pill-label">Income</span>
            <span className="pill-value">₹{income.toFixed(0)}</span>
          </div>
          <div className="snapshot-pill expense">
            <span className="pill-label">Spent</span>
            <span className="pill-value">₹{totalExpenses.toFixed(0)}</span>
          </div>
          <div
            className={`snapshot-pill ${savings >= 0 ? "savings" : "deficit"}`}
          >
            <span className="pill-label">
              {savings >= 0 ? "Saved" : "Deficit"}
            </span>
            <span className="pill-value">₹{Math.abs(savings).toFixed(0)}</span>
          </div>
          <div className="snapshot-pill rate">
            <span className="pill-label">Rate</span>
            <span className="pill-value">{savingsRate}%</span>
          </div>
        </div>

        <div className="advisor-actions">
          <button
            type="button"
            className={`advisor-btn ${loading ? "loading" : ""}`}
            onClick={getAdvice}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" aria-hidden /> Analysing…
              </>
            ) : asked ? (
              "Refresh insights"
            ) : (
              "Get AI advice"
            )}
          </button>
        </div>

        {error && (
          <div className="advisor-error" role="alert">
            {error}
          </div>
        )}

        {advice && (
          <article className="advisor-output">
            <div className="output-topbar">
              <span className="output-badge">Your insights</span>
            </div>
            <div className="output-body">{formatAdvice(advice)}</div>
          </article>
        )}

        {!asked && !loading && (
          <div className="advisor-empty">
            <span className="empty-icon" aria-hidden>
              🧠
            </span>
            <p>
              Tap <strong>Get AI advice</strong> for a concise read on your
              spending, savings rate, and next steps.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

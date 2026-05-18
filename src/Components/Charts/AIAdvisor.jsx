import { useState } from "react";
import "./AIAdvisor.css";

export default function AIAdvisor({ income = 0, expenses = [] }) {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [asked, setAsked] = useState(false);
const[userInput,setUserInput] = useState()
  const totalExpenses = expenses
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const savings = income - totalExpenses;
  const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : 0;

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

  const getAdvice = async () => {
    if (income === 0 && expenses.length === 0) {
      setError("Add some transactions first before asking for advice.");
      return;
    }
    setLoading(true);
    setError("");
    setAdvice("");
    setAsked(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userInput,
        }),
      });

      // const data = await response.json();
      console.log(data);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData?.error?.message || "API error");
      }

      const data = await response.json();
      const text = data.content
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("");
      setAdvice(text);
    } catch (err) {
      setError("Couldn't fetch advice. Check your API connection.");
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
    <div className="advisor-card">
      <div className="advisor-header">
        <div className="advisor-icon">
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
        <div>
          <h2 className="advisor-title">AI Advisor</h2>
          <p className="advisor-sub">Powered by Expenso</p>
        </div>
      </div>

      <div className="snapshot-row">
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

      <button
        className={`advisor-btn ${loading ? "loading" : ""}`}
        onClick={getAdvice}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner" /> Analyzing…
          </>
        ) : asked ? (
          "Refresh Analysis"
        ) : (
          "Get AI Advice"
        )}
      </button>

      {error && <div className="advisor-error">{error}</div>}

      {advice && (
        <div className="advisor-output">
          <div className="output-topbar">
            <span className="output-badge">AI Analysis</span>
          </div>
          <div className="output-body">{formatAdvice(advice)}</div>
        </div>
      )}

      {!asked && !loading && (
        <div className="advisor-empty">
          <span className="empty-icon">🧠</span>
          <p>
            Expenso AI will analyze your spending and suggest where you can save
            more.
          </p>
        </div>
      )}
    </div>
  );
}

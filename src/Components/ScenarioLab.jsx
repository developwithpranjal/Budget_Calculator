import { useMemo, useState } from "react";
import "./ScenarioLab.css";

const MIN_PCT = -30;
const MAX_PCT = 30;

export default function ScenarioLab({ baseIncome, baseExpense }) {
  const [incomePct, setIncomePct] = useState(0);
  const [expensePct, setExpensePct] = useState(0);

  const scenario = useMemo(() => {
    const inc = Number(baseIncome) || 0;
    const exp = Number(baseExpense) || 0;
    const adjInc = inc * (1 + incomePct / 100);
    const adjExp = exp * (1 + expensePct / 100);
    const adjBal = adjInc - adjExp;
    const rate = adjInc > 0 ? ((adjBal / adjInc) * 100).toFixed(1) : "0.0";
    return {
      adjInc,
      adjExp,
      adjBal,
      rate,
      baseBal: inc - exp,
    };
  }, [baseIncome, baseExpense, incomePct, expensePct]);

  return (
    <section className="tool-card scenario-lab" aria-labelledby="scenario-lab-title">
      <div className="tool-card-head">
        <h2 id="scenario-lab-title" className="tool-card-title">
          Scenario lab
        </h2>
        <p className="tool-card-desc">
          Model income and spend shifts without changing your ledger.
        </p>
      </div>

      <div className="scenario-sliders">
        <label className="scenario-field">
          <span className="scenario-label">Income adjustment</span>
          <div className="scenario-row">
            <input
              type="range"
              min={MIN_PCT}
              max={MAX_PCT}
              step={1}
              value={incomePct}
              onChange={(e) => setIncomePct(Number(e.target.value))}
              className="scenario-range"
            />
            <span className="scenario-pct" aria-live="polite">
              {incomePct > 0 ? "+" : ""}
              {incomePct}%
            </span>
          </div>
        </label>

        <label className="scenario-field">
          <span className="scenario-label">Expense adjustment</span>
          <div className="scenario-row">
            <input
              type="range"
              min={MIN_PCT}
              max={MAX_PCT}
              step={1}
              value={expensePct}
              onChange={(e) => setExpensePct(Number(e.target.value))}
              className="scenario-range"
            />
            <span className="scenario-pct" aria-live="polite">
              {expensePct > 0 ? "+" : ""}
              {expensePct}%
            </span>
          </div>
        </label>
      </div>

      <div className="scenario-reset">
        <button
          type="button"
          className="scenario-reset-btn"
          onClick={() => {
            setIncomePct(0);
            setExpensePct(0);
          }}
        >
          Reset to actual
        </button>
      </div>

      <dl className="scenario-results">
        <div className="scenario-result-row">
          <dt>Scenario income</dt>
          <dd>₹{scenario.adjInc.toFixed(0)}</dd>
        </div>
        <div className="scenario-result-row">
          <dt>Scenario expenses</dt>
          <dd>₹{scenario.adjExp.toFixed(0)}</dd>
        </div>
        <div className="scenario-result-row highlight">
          <dt>Scenario balance</dt>
          <dd className={scenario.adjBal >= 0 ? "pos" : "neg"}>
            ₹{scenario.adjBal.toFixed(0)}
          </dd>
        </div>
        <div className="scenario-result-row">
          <dt>Savings vs income</dt>
          <dd>{scenario.rate}%</dd>
        </div>
        <div className="scenario-baseline">
          Actual balance today: ₹{scenario.baseBal.toFixed(0)}
        </div>
      </dl>
    </section>
  );
}

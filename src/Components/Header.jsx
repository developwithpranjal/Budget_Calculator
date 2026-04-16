import React, { useState, useEffect } from "react";
import { MdCurrencyRupee, MdRefresh } from "react-icons/md";

const Header = ({ totalBalance, totalIncome, totalExpense, UsdRate, onRefreshRate }) => {
  const [lastUpdated, setLastUpdated] = useState(null);
  const [cooldown, setCooldown] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(null);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdated) {
        const diff = Math.floor((Date.now() - lastUpdated) / 1000);
        setSecondsAgo(diff);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const handleRefresh = async () => {
    if (cooldown) return;
    setSpinning(true);
    setCooldown(true);
    await onRefreshRate();
    setLastUpdated(Date.now());
    setSecondsAgo(0);
    setSpinning(false);
  };

  const formatAgo = (secs) => {
    if (secs === null) return null;
    if (secs < 60) return `Last updated ${secs}s ago`;
    return `Last updated ${Math.floor(secs / 60)}m ago`;
  };

  return (
    <div className="Header">
      <h2>Balance Overview (All amounts in INR)</h2>
      <div className="usd-rate-row">
        <span className="usd-rate-text">1 USD = ₹{UsdRate ? UsdRate.toFixed(2) : "—"}</span>
        <button
          className={`refresh-btn ${cooldown ? "refresh-disabled" : ""}`}
          onClick={handleRefresh}
          title={cooldown ? "Wait 60s before refreshing again" : "Refresh USD rate"}
        >
          <MdRefresh className={spinning ? "spin" : ""} size={18} />
        </button>
        {secondsAgo !== null && (
          <span className="last-updated">{formatAgo(secondsAgo)}</span>
        )}
        
      </div>

      <h3 className="Total_balance">
        Total Balance: <p><MdCurrencyRupee />{totalBalance.toFixed(2)}</p>
      </h3>
      <h3 className="Total_income">
        Total Income: <p><MdCurrencyRupee />{totalIncome.toFixed(2)}</p>
      </h3>
      <h3 className="Total_expense">
        Total Expenses: <p><MdCurrencyRupee />{totalExpense.toFixed(2)}</p>
      </h3>
    </div>
  );
};

export default Header;
import React from "react";
import { MdCurrencyRupee } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";

const TransactionList = ({ filterTransaction, setFilter, DeleteTrans, activeFilter }) => {
  return (
    <div className="Transaction_history">
      <h1>Transaction History</h1>

      <div className="Buttons">
        <button
          className={activeFilter === "All" ? "filter-active" : ""}
          onClick={() => setFilter("All")}
        >
          All
        </button>
        <button
          className={activeFilter === "USD" ? "filter-active" : ""}
          onClick={() => setFilter("USD")}
        >
          $ USD
        </button>
        <button
          className={activeFilter === "INR" ? "filter-active" : ""}
          onClick={() => setFilter("INR")}
        >
          <MdCurrencyRupee /> INR
        </button>
      </div>

      {filterTransaction.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">📭</p>
          <p className="empty-text">No transactions found.</p>
          <p className="empty-sub">Add one using the form on the left.</p>
        </div>
      ) : (
        filterTransaction.map((obj) => (
          <div key={obj.id} className={`transaction-item transaction-${obj.type}`}>
            <div className="transaction-left">
              <span className="transaction-title">{obj.Title}</span>
              <div className="transaction-meta">
                {obj.category && <span className="meta-tag">{obj.category}</span>}
                <span className="meta-currency">{obj.currencyType}</span>
              </div>
            </div>
            <div className="transaction-right">
              <span
                className="transaction-amount"
                style={{ color: obj.type === "income" ? "#10b981" : "#f43f5e" }}
              >
                {obj.type === "income" ? "+" : "−"}
                <MdCurrencyRupee />
                {obj.TransactionAmount.toFixed(2)}
              </span>
              <ImCancelCircle
                onClick={() => DeleteTrans(obj.id)}
                className="Deletebtn"
                title="Delete transaction"
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TransactionList;
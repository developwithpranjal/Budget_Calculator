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
          $USD
        </button>
        <button
          className={activeFilter === "INR" ? "filter-active" : ""}
          onClick={() => setFilter("INR")}
        >
          <MdCurrencyRupee />INR
        </button>
      </div>

      {filterTransaction.length === 0 && (
        <p style={{ color: "#6b7280", textAlign: "center", marginTop: "20px" }}>
          No transactions found.
        </p>
      )}

      {filterTransaction.map((obj) => (
        <div key={obj.id}>
          <span>{obj.Title}</span>
          <span style={{ color: "#9ca3af", fontSize: "13px" }}>{obj.category}</span>
          <span style={{ color: "#6b7280", fontSize: "13px" }}>{obj.currencyType}</span>
          <span style={{ color: obj.type === "income" ? "#22c55e" : "#ef4444", fontWeight: "bold" }}>
            {obj.type === "income" ? "+" : "-"}
            <MdCurrencyRupee />
            {obj.TransactionAmount.toFixed(2)}
          </span>
          <ImCancelCircle onClick={() => DeleteTrans(obj.id)} className="Deletebtn" />
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
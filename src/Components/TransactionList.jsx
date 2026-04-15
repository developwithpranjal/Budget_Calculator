import React from "react";
import { MdCurrencyRupee } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";

const TransactionList = ({ filterTransaction, setFilter, DeleteTrans }) => {
  return (
    <div className="Transaction_history">
      <h1>Transaction History</h1>
      <div className="Buttons">
        <button onClick={() => setFilter("All")}>All</button>
        <button onClick={() => setFilter("USD")}>$USD</button>
        <button onClick={() => setFilter("INR")}><MdCurrencyRupee />INR</button>
      </div>
      {filterTransaction.map((obj) => (
        <div key={obj.id}>
          <span>{obj.Title}</span>
          <span>{obj.category}</span>
          <span>{obj.currencyType}</span>
          <span style={{ color: obj.type === "income" ? "green" : "red", fontWeight: "bold" }}>
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
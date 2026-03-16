import React, { useState } from "react";
import { MdCurrencyRupee } from "react-icons/md";
const Calculator = () => {
  const [incometype, setIncomeType] = useState("");
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [Transaction, setTransaction] = useState([]);

  function AddIncome() {
    const obj = {
      id: Date.now(),
      Title: description,
      currencyType: currency,
      type: incometype,
      TransactionAmount: Number(amount),
    };
    console.log(obj);

    setTransaction([...Transaction, obj]);
    setIncomeType("");
    setCurrency("");
    setAmount("");
    setDescription("");
  }
  const totalIncome = Transaction.reduce((acc, obj) => {
    if (obj.type === "income") {
      return acc + obj.TransactionAmount;
    }
    return acc;
  }, 0);

  const totalExpense = Transaction.reduce((acc, obj) => {
    if (obj.type === "expense") {
      return acc + obj.TransactionAmount;
    }
    return acc;
  }, 0);

  const totalBalance = totalIncome - totalExpense;
  return (
    <div className="Container">
      <h1>Budget Tracker</h1>
      <p>Track your income and expenses in multiple currencies</p>
      <div className="Header">
        <h2>Balance overview (ALL amounts in INR)</h2>
        <p>1 USD = 92.70 INR</p>
        <h3 className="Total_balance">
          Total Balance:{" "}
          <p>
            {" "}
            <MdCurrencyRupee />
            {totalBalance}
          </p>
        </h3>
        <h3 className="Total_income">
          Total Income:{" "}
          <p>
            {" "}
            <MdCurrencyRupee />
            {totalIncome}
          </p>
        </h3>
        <h3 className="Total_expense">
          Total Expenses:{" "}
          <p>
            {" "}
            <MdCurrencyRupee />
            {totalExpense}
          </p>
        </h3>
      </div>
      <div className="Transaction_box">
        <div className="Add_transaction">
          <h1>Add Transaction</h1>
          <label htmlFor="">Type:</label>
          <select
            className="transaction_type"
            name=""
            id=""
            onChange={(e) => setIncomeType(e.target.value)}
            value={incometype}
          >
            <option value="">Select income type</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <label htmlFor="">Currency:</label>
          <select
            name=""
            id=""
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="">Select Currency</option>

            <option value="INR">
              {" "}
              <MdCurrencyRupee />
              INR- Indian Rupee
            </option>
            <option value="USD">$USD- US Dollar</option>
          </select>
          <label htmlFor="">
            Amount(
            <MdCurrencyRupee />
            ):
          </label>
          <input
            type="number"
            placeholder="0.00"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
          />
          <label htmlFor="">Description</label>
          <input
            type="text"
            placeholder="Enter Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          <button className="AddExpense" onClick={() => AddIncome()}>
            Add Expense(INR)
          </button>
        </div>
        <div className="Transaction_history">
          <h1>Transaction History</h1>
          <div className="Buttons">
            <button>All</button>
            <button>$USD</button>
            <button>
              <MdCurrencyRupee />
              INR
            </button>
          </div>
          {Transaction.map((obj) => {
            return (
              <div>
                <span>{obj.Title}</span>
                <span>{obj.currencyType}</span>
                <span
                  style={{
                    color: obj.type === "income" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {obj.type === "income" ? "+" : "-"}
                  <MdCurrencyRupee />
                  {obj.TransactionAmount}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calculator;

import React, { useEffect, useState } from "react";
import { MdCurrencyRupee } from "react-icons/md";
const Calculator = () => {
  const [incometype, setIncomeType] = useState("");
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [Transaction, setTransaction] = useState([]);
  const [UsdRate, setUsdRate] = useState(0);
  const [Filter, setFilter] = useState("All");
  useEffect(() => {
    CurrConversion();
  }, []);
  async function CurrConversion() {
    const response = await fetch("https://open.er-api.com/v6/latest/USD");
    const result = await response.json();
    console.log(result);
    setUsdRate(result.rates.INR);
  }
  function AddIncome() {
    let ConvertedAmout = Number(amount);
    if (currency === "USD") {
      ConvertedAmout = Number(amount) * UsdRate;
    }

    const obj = {
      id: Date.now(),
      Title: description,
      currencyType: currency,
      type: incometype,
      TransactionAmount: ConvertedAmout,
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
  const filterTransaction =
    Filter === "All"
      ? Transaction
      : Transaction.filter((obj) => obj.currencyType === Filter);
  return (
    <div className="Container">
      <h1>Budget Tracker</h1>
      <p>Track your income and expenses in multiple currencies</p>
      <div className="Header">
        <h2>Balance overview (ALL amounts in INR)</h2>
        <p>1 USD = {UsdRate}</p>
        <h3 className="Total_balance">
          Total Balance:{" "}
          <p>
            {" "}
            <MdCurrencyRupee />
            {totalBalance.toFixed(2)}
          </p>
        </h3>
        <h3 className="Total_income">
          Total Income:{" "}
          <p>
            {" "}
            <MdCurrencyRupee />
            {totalIncome.toFixed(2)}
          </p>
        </h3>
        <h3 className="Total_expense">
          Total Expenses:{" "}
          <p>
            {" "}
            <MdCurrencyRupee />
            {totalExpense.toFixed(2)}
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
            <button onClick={() => setFilter("All")}>All</button>
            <button onClick={() => setFilter("USD")}>$USD</button>
            <button onClick={() => setFilter("INR")}>
              <MdCurrencyRupee />
              INR
            </button>
          </div>
          {filterTransaction.map((obj) => {
            return (
              <div key={obj.id}>
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
                  {obj.TransactionAmount.toFixed(2)}
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

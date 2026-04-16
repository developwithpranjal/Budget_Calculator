import React from "react";
import { MdCurrencyRupee } from "react-icons/md";
import CategorySelector from "./CategorySelector";
const AddTransaction = ({
  incometype, setIncomeType,
  currency, setCurrency,
  amount, setAmount,
  description, setDescription,
  category, setCategory,
  AddIncome, user
}) => {
  return (
    <div className="Add_transaction">
      <h1>Add Transaction</h1>
      <label>Type:</label>
      <select
        className="transaction_type"
        onChange={(e) => setIncomeType(e.target.value)}
        value={incometype}
      >
        <option value="">Select Transaction type</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <label>Currency:</label>
      <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
        {/* <option value="">Select Currency</option> */}
        <option value="INR">INR- Indian Rupee</option>
        <option value="USD">$USD- US Dollar</option>
      </select>

      <label>Amount(<MdCurrencyRupee />):</label>
      <input
        type="number"
        placeholder="0.00"
        onChange={(e) => setAmount(e.target.value)}
        value={amount}
      />

      <label>Description</label>
      <input
        type="text"
        placeholder="e.g. Groceries,food"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
      />

      {incometype && amount && (
        <CategorySelector category={category} setCategory={setCategory} />
      )}

      <button className="AddExpense" onClick={AddIncome} disabled={!user}>
        {incometype === "income" ? "Add Income (INR)" : incometype === "expense" ? "Add Expense (INR)" : "Add Transaction (INR)"}
      </button>
    </div>
  );
};

export default AddTransaction;
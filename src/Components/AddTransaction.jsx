import React from "react";
import { MdCurrencyRupee, MdAttachMoney } from "react-icons/md";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import CategorySelector from "./CategorySelector";

const AddTransaction = ({
  incometype, setIncomeType,
  currency, setCurrency,
  amount, setAmount,
  description, setDescription,
  category, setCategory,
  AddIncome, user
}) => {
  const isFormComplete =
    incometype !== "" &&
    currency !== "" &&
    amount !== "" &&
    Number(amount) > 0 &&
    description.trim() !== "" &&
    category !== "";

  return (
    <div className="Add_transaction">
      <h2 className="section-title">Add Transaction</h2>

      <div className="field-group">
        <label className="field-label">Transaction Type</label>
        <div className="toggle-group">
          <button
            type="button"
            className={`toggle-btn income-toggle ${incometype === "income" ? "toggle-active-income" : ""}`}
            onClick={() => setIncomeType("income")}
          >
            <FaArrowTrendUp className="toggle-icon" />
            Income
          </button>
          <button
            type="button"
            className={`toggle-btn expense-toggle ${incometype === "expense" ? "toggle-active-expense" : ""}`}
            onClick={() => setIncomeType("expense")}
          >
            <FaArrowTrendDown className="toggle-icon" />
            Expense
          </button>
        </div>
      </div>

      <div className="field-group">
        <label className="field-label">Currency</label>
        <div className="toggle-group">
          <button
            type="button"
            className={`toggle-btn ${currency === "INR" ? "toggle-active-currency" : ""}`}
            onClick={() => setCurrency("INR")}
          >
            <MdCurrencyRupee className="toggle-icon" />
            INR
          </button>
          <button
            type="button"
            className={`toggle-btn ${currency === "USD" ? "toggle-active-currency" : ""}`}
            onClick={() => setCurrency("USD")}
          >
            <MdAttachMoney className="toggle-icon" />
            USD
          </button>
        </div>
      </div>

      <div className="field-group">
        <label className="field-label">Amount ({currency === "USD" ? "$" : "₹"})</label>
        <input
          type="number"
          placeholder="0.00"
          min="0"
          step="0.01"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
          className="field-input"
        />
      </div>

      <div className="field-group">
        <label className="field-label">Description</label>
        <input
          type="text"
          placeholder="e.g. Groceries, Salary, Rent..."
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="field-input"
        />
      </div>

      <div className="field-group">
        <CategorySelector category={category} setCategory={setCategory} />
      </div>

      <button
        className="AddExpense"
        onClick={AddIncome}
        disabled={!user || !isFormComplete}
        title={!isFormComplete ? "Please fill all fields to continue" : ""}
      >
        {!user
          ? "Login to Add Transaction"
          : incometype === "income"
          ? "+ Add Income"
          : incometype === "expense"
          ? "+ Add Expense"
          : "+ Add Transaction"}
      </button>

      {!isFormComplete && user && (
        <p className="form-hint">Fill all fields above to enable this button</p>
      )}
    </div>
  );
};

export default AddTransaction;
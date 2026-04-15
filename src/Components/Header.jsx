import React from "react";
import { MdCurrencyRupee } from "react-icons/md";

const Header = ({ totalBalance, totalIncome, totalExpense, UsdRate }) => {
  return (
    <div className="Header">
      <h2>Balance overview (ALL amounts in INR)</h2>
      <p>1 USD = {UsdRate}</p>
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
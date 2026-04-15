import React from "react";
import ExpensePieChart from "../Components/Charts/ExpensePieChart";
import IncomeBarChart from "../Components/Charts/IncomeBarChart";

const Analytics = ({ transactions }) => {
  const totalIncome = transactions.reduce(
    (acc, t) => (t.type === "income" ? acc + t.TransactionAmount : acc), 0
  );
  const totalExpense = transactions.reduce(
    (acc, t) => (t.type === "expense" ? acc + t.TransactionAmount : acc), 0
  );

  const barData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
  ];

  return (
    <div className="Container">
      <h1>Analytics</h1>
      <p>See Your Expense and Income Breakdown</p>
      <ExpensePieChart transactions={transactions} />
      <IncomeBarChart data={barData} />
    </div>
  );
};

export default Analytics;
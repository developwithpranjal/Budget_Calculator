import React from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#6366f1", "#f59e0b", "#10b981", "#ef4444",
  "#3b82f6", "#ec4899", "#14b8a6", "#f97316",
];

const ExpensePieChart = ({ transactions }) => {
  // Category-wise expense calculate karo
  const categoryData = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      const found = acc.find((item) => item.name === t.category);
      if (found) {
        found.value += t.TransactionAmount;
      } else {
        acc.push({ name: t.category || "Other", value: t.TransactionAmount });
      }
      return acc;
    }, []);

  if (categoryData.length === 0) {
    return (
      <div className="chart-card">
        <h2>Expense by Category</h2>
        <p style={{ color: "#9ca3af", textAlign: "center", paddingTop: "60px" }}>
          No expense yet
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 350 }} className="chart-card">
      <h2>Expense by Category</h2>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            outerRadius={110}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {categoryData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(val) => `₹${val.toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpensePieChart;